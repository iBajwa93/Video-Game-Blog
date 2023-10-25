require("../models/database");
const Game = require("../models/Game");
const Story = require("../models/Story");

/**
 * GET /
 * Homepage
 */

//homepage is an asyncronous function
exports.homepage = async (req, res) => {
  try {
    const limitNumber = 5;
    const games = await Game.find({}).limit(limitNumber);

    //finds the latest 5 stories of all games to show on the homepage
    const latest = await Story.find({}).sort({ _id: -1 }).limit(limitNumber);

    //finds the latest 5 stories of each game to show on the homepage

    const skyrim = await Story.find({
      Game: "The Elder Scrolls V: Skyrim",
    }).limit(limitNumber);
    const mh_world = await Story.find({ Game: "Monster Hunter World" }).limit(
      limitNumber
    );
    const cb_2077 = await Story.find({ Game: "Cyberpunk 2077" }).limit(
      limitNumber
    );
    const ER = await Story.find({ Game: "Elden Ring" }).limit(limitNumber);
    const sc6 = await Story.find({ Game: "Soul Calibur 6" }).limit(limitNumber);
    const fo4 = await Story.find({ Game: "Fallout 4" }).limit(limitNumber);
    const bg3 = await Story.find({ Game: "Baldur's Gate III" }).limit(
      limitNumber
    );
    const pfWOTR = await Story.find({
      Game: "Pathfinder: Wrath of the Righteous",
    }).limit(limitNumber);

    const entry = {
      latest,
      skyrim,
      mh_world,
      cb_2077,
      ER,
      sc6,
      fo4,
      bg3,
      pfWOTR,
    };

    //Randomizes the index page picture
    const indexImageList = [
      "Main_Icon.jpg",
      "Main_Icon2.jpg",
      "Main_Icon3.jpg",
      "Main_Icon4.jpg",
      "Main_Icon5.jpg",
    ];

    selectedImage =
      indexImageList[Math.floor(Math.random() * indexImageList.length)];

    res.render("index", {
      title: "Video Game Blog - Home",
      games,
      entry,
      selectedImage,
      isAuthenticated: req.session.isLoggedIn,
      isAdmin: req.session.adminUser,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * GET /games
 * Games
 */

exports.exploreGames = async (req, res) => {
  try {
    const limitNumber = 20;
    const games = await Game.find({}).limit(limitNumber);

    res.render("games", {
      title: "Video Game Blog - Games",
      games,
      isAuthenticated: req.session.isLoggedIn,
      isAdmin: req.session.adminUser,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * GET /games/:id
 * Games By Id
 */

exports.exploreGamesById = async (req, res) => {
  try {
    let gameId = req.params.id;
    const limitNumber = 20;
    const gameById = await Story.find({ game: gameId }).limit(limitNumber);
    res.render("games", {
      title: "Video Game Blog - Games",
      gameById,
      isAuthenticated: req.session.isLoggedIn,
      isAdmin: req.session.adminUser,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * GET /Story/:id
 * Story
 */

exports.exploreStory = async (req, res) => {
  try {
    //takes the id parameters of the requested url (which is written after /Story/) and puts it in a variable
    let storyId = req.params.id;
    const story = await Story.findById(storyId);

    res.render("story", {
      title: "Video Game Blog - Story",
      story,
      isAuthenticated: req.session.isLoggedIn,
      isAdmin: req.session.adminUser,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * POST /search
 * Search
 */

exports.searchStory = async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    let story = await Story.find({
      $text: { $search: searchTerm, $diacriticSensitive: true },
    });
    res.render("search", {
      title: "Video Game Blog - Search",
      story,
      isAuthenticated: req.session.isLoggedIn,
      isAdmin: req.session.adminUser,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * GET /explore-latest
 * Explore Latest
 */

exports.exploreLatest = async (req, res) => {
  try {
    const limitNumber = 20;
    const story = await Story.find({}).sort({ _id: -1 }).limit(limitNumber);
    res.render("explore-latest", {
      title: "Video Game Blog - Explore Latest",
      story,
      isAuthenticated: req.session.isLoggedIn,
      isAdmin: req.session.adminUser,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * GET /explore-random
 * Explore Random as JSON
 */

exports.exploreRandom = async (req, res) => {
  try {
    let count = await Story.find().countDocuments();
    let random = Math.floor(Math.random() * count);
    let story = await Story.findOne().skip(random).exec();
    if (count == 0) {
      res.redirect("/");
      console.log("No stories have been added yet!");
    } else {
      res.render("explore-random", {
        title: "Video Game Blog - Explore Random",
        story,
        isAuthenticated: req.session.isLoggedIn,
        isAdmin: req.session.adminUser,
      });
    }
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};
