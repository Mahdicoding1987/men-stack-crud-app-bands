const mongoose = require("mongoose");

const bandSchema = new mongoose.Schema({
    name: String,
    isStillActive: Boolean,
  });

  const band = mongoose.model("band", bandSchema); // create model

  module.exports = band;

