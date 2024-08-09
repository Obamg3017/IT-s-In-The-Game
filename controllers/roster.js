import express from "express";
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

export default router;
