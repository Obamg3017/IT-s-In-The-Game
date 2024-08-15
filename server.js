import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import methodOverride from "method-override";
import morgan from "morgan";
import session from "express-session";
import authController from "./controllers/auth.js";
import playerController from "./controllers/players.js";
import rosterController from "./controllers/roster.js";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";

dotenv.config();
const app = express();

const port = process.env.PORT || "3000";
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
mongoose.connect(process.env.MONGODB_URI);
const finalPath = path.join(__dirname, "/public");
app.use(express.static(finalPath));
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.urlencoded({ extended: false }));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(methodOverride("_method"));

app.use(morgan("dev"));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

//Route

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

const port1 = process.env.PORT || "3000";
app.listen(port, () => {
  console.log(`Listening on port ${port1}`);
});



// import express from "express";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import methodOverride from "method-override";
// import morgan from "morgan";
// import session from "express-session";
// import MongoStore from "connect-mongo"; // Import MongoStore
// import authController from "./controllers/auth.js";
// import playerController from "./controllers/players.js";
// import rosterController from "./controllers/roster.js";
// import path from "path";
// import { fileURLToPath } from "url";
// import bodyParser from "body-parser";

// dotenv.config();
// const app = express();

// const port = process.env.PORT || "3000";
// const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
// const __dirname = path.dirname(__filename); // get the name of the directory
// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const finalPath = path.join(__dirname, "/public");
// app.use(express.static(finalPath));
// mongoose.connection.on("connected", () => {
//   console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
// });

// app.use(express.urlencoded({ extended: false }));

// app.use(bodyParser.urlencoded({ extended: true }));

// app.use(methodOverride("_method"));

// app.use(morgan("dev"));

// // Use MongoStore for session storage
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }), // Store sessions in MongoDB
//     cookie: { secure: process.env.NODE_ENV === "production" }, // Ensure cookies are secure in production
//   })
// );

// // Route
// app.get("/", async (req, res) => {
//   res.render("index.ejs", {
//     user: req.session.user,
//   });
// });

// app.use("/auth", authController);
// app.use("/players", playerController);
// app.use("/roster", rosterController);

// app.listen(port, () => {
//   // Bind to the correct port
//   console.log(`Listening on port ${port}`);
// });
