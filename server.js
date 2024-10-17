// Here is where we import modules
// We begin by loading Express
const dotenv = require("dotenv"); // require package
dotenv.config(); // Loads the environment variables from .env file

const express = require("express");

const mongoose = require("mongoose"); // require package

const methodOverride = require("method-override"); // new
const morgan = require("morgan"); //new

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
app.use(methodOverride("_method")); // new
app.use(morgan("dev")); //new

// GET /
app.get("/", async (req, res) => {
    res.render("index.ejs");
  });

// GET /bands
app.get("/bands", async (req, res) => {
    const allBands = await band.find();
    res.render("bands/index.ejs", { bands: allBands });
  });

// GET /bands/new
app.get("/bands/new", (req, res) => {
    res.render("bands/new.ejs");
  });

  app.get("/bands/:bandId", async (req, res) => {
    const foundBand = await band.findById(req.params.bandId);
    res.render("bands/show.ejs", { band: foundBand });
});

// POST /bands
app.post("/bands", async (req, res) => {
    if (req.body.isStillActive === "on") {
      req.body.isStillActive = true;
    } else {
      req.body.isStillActive = false;
    }
    await band.create(req.body);
    res.redirect("/bands"); // redirect to index fruits
  });

  // GET localhost:3000/fruits/:fruitId/edit
app.get("/bands/:bandId/edit", async (req, res) => {
    const foundBand = await band.findById(req.params.bandId);
    res.render("bands/edit.ejs", {
        band: foundBand,
      });
    });

  app.delete("/bands/:bandId", async (req, res) => {
    await band.findByIdAndDelete(req.params.bandId);
    res.redirect("/bands");
  });

  app.put("/bands/:bandId", async (req, res) => {
    // Handle the 'isReadyToEat' checkbox data
    if (req.body.isStillActive === "on") {
      req.body.isStillActive = true;
    } else {
      req.body.isStillActive = false;
    }
    
    // Update the fruit in the database
    await band.findByIdAndUpdate(req.params.bandId, req.body);
  
    // Redirect to the fruit's show page to see the updates
    res.redirect(`/bands/${req.params.bandId}`);
  });

app.listen(3000, () => {
  console.log("Listening on port 3000");
});