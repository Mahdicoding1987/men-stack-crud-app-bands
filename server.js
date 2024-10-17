// Here is where we import modules
// We begin by loading Express
const dotenv = require("dotenv"); // require package
dotenv.config(); // Loads the environment variables from .env file

const express = require("express");

const mongoose = require("mongoose"); // require package

const app = express();

// Connect to MongoDB using the connection string in the .env file
mongoose.connect(process.env.MONGODB_URI);
// log connection status to terminal on start
mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
  });

// Import the band model
const band = require("./models/band.js");

app.use(express.urlencoded({ extended: false }));

// GET /
app.get("/", async (req, res) => {
    res.render("index.ejs");
  });

// GET /bands
app.get("/bands", async (req, res) => {
    const allBands = await band.find();
    console.log(allBands)
    res.render("bands/index.ejs", { bands: allBands });
  });

// GET /bands/new
app.get("/bands/new", (req, res) => {
    res.render("bands/new.ejs");
  });

// POST /bands
app.post("/bands", async (req, res) => {
    if (req.body.isStillActive === "on") {
        req.body.isStillActive = true;
      } else {
        req.body.isStillActive = false;
      }
      await band.create(req.body);
      res.redirect("/bands/new");
    });

app.listen(3000, () => {
  console.log("Listening on port 3000");
});