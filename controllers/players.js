import express from "express";
import { getAllPlayers, getSearchPlayers, getPlayerStats,} from "../utilities/nbaApiConnection.js";
import User from "../models/user.js";
import Roster from "../models/roster.js";
const router = express.Router();

router.get("/", async (req, res) => {
  const playerData = await getAllPlayers();

  res.render("../views/players/players.ejs", {
    players: playerData.data,
  });
});
// Route to handle search queries.
router.get("/search", async (req, res) => {
  const query = req.query.search.toLowerCase();

  const playerData = await getSearchPlayers(query);

  res.render("../views/players/players.ejs", {
    players: playerData.data,
  });
});

router.post("/", async (req, res) => {
  try {
    const { playerId } = req.body;
    const sessionUser = req.session.user;
    // Find the user by their ID.
    if (!sessionUser) {
      return res.status(404).json({ error: "User not found" });
    }

    let user = await User.findById(sessionUser._id).populate("roster");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Fetch player stats.
    const playerStats = await getPlayerStats(playerId);

    if (
      !playerStats ||
      !Array.isArray(playerStats.data) ||
      playerStats.data.length === 0
    ) {
      return res.status(404).json({ error: "Player stats not found" });
    }

    const { reb = 0, ast = 0, pts = 0 } = playerStats.data[0]; // Extracting the stats

    console.log(playerStats.data[0]);
    // Check if the user has a roster, if not, create one
    if (!user.roster) {
      const newRoster = new Roster({
        name: `${user.username}'s Roster`,
        totalPoints: Number(pts),
        totalRebounds: Number(reb),
        totalAssists: Number(ast),
        playerIDs: [playerId],
      });

      // Save the new roster
      const savedRoster = await newRoster.save();

      // Assign the roster to the user
      user.roster = savedRoster._id;
    } else {
      // If the roster already exists, just add the player ID and update stats
      if (user.roster.playerIDs.length >= 5) {
        return res
          .status(404)
          .json({ error: "You Have Added The Maximum Amount Of Players" });
        //add alert here once you get go ahead from instructor
      }
      if (user.roster.playerIDs.includes(playerId)) {
        return res.status(404).json({ error: "This Player is already added" });
        //add alert here once you get go ahead from instructor
      }
      user.roster.playerIDs.push(playerId);

      // Ensure these fields are numbers before updating
      user.roster.totalPoints = Number(user.roster.totalPoints) + Number(pts);
      user.roster.totalRebounds =
        Number(user.roster.totalRebounds) + Number(reb);
      user.roster.totalAssists = Number(user.roster.totalAssists) + Number(ast);

      await user.roster.save();
    }

    // Save the updated user
    await user.save();

    // Redirect to the rosters page after adding the player
    res.redirect("/roster");
  } catch (error) {
    console.error("Error adding player to roster:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Resources that were referenced for this project
// 1. https://www.youtube.com/watch?v=zBTPDAh8ABM&list=PL6u82dzQtlfvJoAWdyf5mUxPQRnNKCMGt
// 2. https://www.youtube.com/watch?v=EkQc-8uzxIA
// 3. Stack Overflow
// 4. Reading Documentation on api website https://docs.balldontlie.io/
// 5. ChatGPT for explaining how to implement API and to also add total stats in roster.ejs
// 6. Reaching out for help with GA staff/instructor
// 7. Reaching out for help in communities that I am a part of. ie: BIT, Code & Coffee, and Brilliant-Black-Minds
// 8. https://www.youtube.com/watch?v=AGWwa25ZlRY (assisted me with try & catch/res.status(404) error handling)
export default router;
