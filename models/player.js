import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  team: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
  rebounds: {
    type: Number,
    required: true,
  },
  assists: {
    type: Number,
    required: true,
  },
});

const Player = mongoose.model('Player', playerSchema)

export default Player