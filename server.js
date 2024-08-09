import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import methodOverride from "method-override";
import morgan from "morgan";
import session from "express-session";
import authController from "./controllers/auth.js";
import playerController from "./controllers/players.js";
import rosterController from "./controllers/roster.js";

dotenv.config();
const app = express();

const port = process.env.PORT || "3000";

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.urlencoded({ extended: false }));

app.use(methodOverride("_method"));

app.use(morgan("dev"));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

//  app.use(express.static("public"))

//Routes

app.get("/", async (req, res) => {
  res.render("index.ejs", {
    user: req.session.user,
  });
});

app.use("/auth", authController);

app.use("/players", playerController);
app.use("/roster", rosterController);

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
