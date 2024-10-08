import mongoose from "mongoose";
import rosterSchema from "./roster.js";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  roster: { type: mongoose.Schema.Types.ObjectId, ref: rosterSchema },
});

const User = mongoose.model("User", userSchema);

export default User;