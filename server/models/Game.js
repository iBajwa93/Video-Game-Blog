const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: "This field is required.",
  },
  image: {
    type: String,
    required: "This field is required.",
  },
});

module.exports = mongoose.model("Game", gameSchema);
