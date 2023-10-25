const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

/**
 * App Admin Routes
 */

router.get("/submit-story", adminController.submitStory);

router.post("/submit-story", adminController.submitStoryOnPost);

router.get("/edit-story/:storyId", adminController.getEditStory);

router.post("/edit-story", adminController.postEditStory);

router.post("/delete-story", adminController.postDeleteStory);

module.exports = router;
