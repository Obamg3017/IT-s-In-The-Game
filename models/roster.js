import mongoose from "mongoose";
import playerSchema from "./player.js";


const rosterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  totalPoints: {
    type: Number,
    required: true,
  },
  totalRebounds: {
    type: Number,
    required: true,
  },
  totalAssists: {
    type: Number,
    required: true,
  },
  players: [playerSchema],
});

const Roster = mongoose.model('Roster', rosterSchema)

export default Roster