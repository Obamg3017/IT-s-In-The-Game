import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import methodOverride from 'method-override';
import morgan from 'morgan';
import session from 'express-session'
import authController from './controllers/auth.js'



dotenv.config()
const app = express();

const port = process.env.PORT || "3000";


mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", ()=>{
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`)
});

app.use(express.urlencoded({ extended: false}));

app.use(methodOverride("_method"));

app.use(morgan('dev'));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
//if you want to start css
//  app.use(express.static(""))

//Routes

app.get("/", async (req, res) => {
  res.render("index.ejs", {
    user: req.session.user,
  });
});

app.get("/vip-lounge", async (req, res) => {
  if (req.session.user) {
    res.send(`Welcome to the party ${req.session.user.username}.`);
  } else {
    res.redirect("/auth/sign-in");
  }
});

app.use("/auth", authController);


app.listen(3000, ()=>{
    console.log("Listening on port 3000")
})