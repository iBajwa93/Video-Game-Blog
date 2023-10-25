const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");

/**
 * App Blog Routes
 */

router.get("/", blogController.homepage);
router.get("/story/:id", blogController.exploreStory);
router.get("/games", blogController.exploreGames);
router.get("/games/:id", blogController.exploreGamesById);
router.post("/search", blogController.searchStory);
router.get("/explore-latest", blogController.exploreLatest);
router.get("/explore-random", blogController.exploreRandom);

module.exports = router;
