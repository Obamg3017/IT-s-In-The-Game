import mongoose from "mongoose";

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
  playerIDs: [{ type: String }],
});

const Roster = mongoose.model("Roster", rosterSchema);

export default Roster;
