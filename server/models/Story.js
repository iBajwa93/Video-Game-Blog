const mongoose = require("mongoose");

const storySchema = new mongoose.Schema({
  name: {
    type: String,
    required: "This field is required.",
  },

  date: {
    type: String,
    required: "This field is required.",
  },
  description: {
    type: String,
    required: "This field is required.",
  },

  game: {
    type: String,
    //enumerate through this array
    enum: [
      "The Elder Scrolls V: Skyrim",
      "Monster Hunter World",
      "Cyberpunk 2077",
      "Elden Ring",
      "Soul Calibur 6",
      "Fallout 4",
      "Baldur's Gate III",
      "Pathfinder: Wrath of the Righteous",
    ],
    required: "This field is required.",
  },
  image: {
    type: String,
    required: "This field is required.",
  },
});

//field terms we will use for searching
storySchema.index({ name: "text", description: "text" });

//WildCard indexing
// storySchema.index({ "$**": "text" });

module.exports = mongoose.model("Story", storySchema);
