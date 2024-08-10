import express from "express";
import Roster from "../models/roster.js";
import User from "../models/user.js";
import { getSinglePlayer } from "../utilities/nbaApiConnection.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const sessionUser = req.session.user;
    console.log(sessionUser);

    if (!sessionUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the user by ID and populate their roster
    let user = await User.findById(sessionUser._id).populate("roster");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // If the user does not have a roster, render a message indicating this
    if (!user.roster || user.roster.playerIDs.length === 0) {
      return res.render("../views/roster/roster.ejs", {
        players: [],
        roster: null,
        message: "No roster found. Please add players to create a roster.",
      });
    }

    // Initialize an array to store player data
    const playerDataArray = [];

    // Fetch data for each player ID in the roster
    for (const playerId of user.roster.playerIDs) {
      const playerData = await getSinglePlayer(playerId); // Assuming getSinglePlayer accepts a playerId
      if (playerData) {
        playerDataArray.push(playerData.data); // Assuming player data is in `data`
      }
      // Get player stats here
      // Step1: Define the vars

      // Step2: for each player get stats and add them to the
    }
    // Render the roster with the player data
    res.render("../views/roster/roster.ejs", {
      players: playerDataArray,
      roster: user.roster,

      message: null,
    });
  } catch (error) {
    console.error("Error fetching roster players:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.delete("/", async (req, res) => {
  const sessionUser = req.session.user;
  if (!sessionUser) {
    return res.status(404).json({ error: "User not found" });
  }

  // Find the user by ID and populate their roster
  let user = await User.findById(sessionUser._id).populate("roster");

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  if (!user.roster) {
    return res.status(404).json({ error: "Roster not found" });
  }

  const deleteRoster = await Roster.findByIdAndDelete(user.roster._id);
  res.redirect("/players");
});

router.put("/", async (req, res) => {
  const sessionUser = req.session.user;
  const { rosterName } = req.body;

  if (!sessionUser) {
    return res.status(404).json({ error: "User not found" });
  }

  // Find the user by ID and populate their roster
  let user = await User.findById(sessionUser._id).populate("roster");

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  if (!user.roster) {
    return res.status(404).json({ error: "Roster not found" });
  }

  const updateRosterName = await Roster.findByIdAndUpdate(
    user.roster._id,
    { name: rosterName },
    { new: true } // This option returns the updated document
  );
  res.redirect("/roster");
});
export default router;
