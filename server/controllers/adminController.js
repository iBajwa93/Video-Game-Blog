require("../models/database");
const Game = require("../models/Game");
const Story = require("../models/Story");

/**
 * GET /submit-Story
 * Submit Story
 */

exports.submitStory = async (req, res) => {
  const adminLife = req.session.adminUser;
  const infoErrorsObj = req.flash("infoErrors");
  const infoSubmitObj = req.flash("infoSubmit");
  res.render("submit-story", {
    title: "Video Game Blog - Submit Story",
    infoErrorsObj,
    infoSubmitObj,
    isAuthenticated: req.session.isLoggedIn,
    isAdmin: req.session.adminUser,
  });
};

/**
 * POST /submit-Story
 * Submit Story
 */

exports.submitStoryOnPost = async (req, res) => {
  try {
    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if (!req.files || Object.keys(req.files).length === 0) {
      console.log("No Files were uploaded.");
    } else {
      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;
      //uploads the image to the folder specified, if deleting a story we must currently manually delete the image file in the folder itself
      uploadPath =
        require("path").resolve("./") + "/public/uploads/" + newImageName;

      //mv will upload the file to the specified path
      imageUploadFile.mv(uploadPath, function (err) {
        if (err) return res.status(500).send(err);
      });
    }
    //accepts user inputs
    const newStory = new Story({
      name: req.body.name,
      date: req.body.date,
      description: req.body.description,
      game: req.body.game,
      image: newImageName,
    });

    await newStory.save();

    req.flash("infoSubmit", "Story successfully added!");
    res.redirect("/admin/submit-story");
  } catch (error) {
    req.flash("infoErrors", error);
    res.redirect("/admin/submit-story");
  }
};

/**
 * GET /edit-story
 * Edit Story
 */

exports.getEditStory = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    res.redirect("/");
  }
  const storyObj = req.params.storyId;
  Story.findById(storyObj)
    .then((story) => {
      if (!story) {
        return res.redirect("/");
      }
      res.render("admin/edit-story", {
        pageTitle: "Edit Story",
        path: "/admin/edit-story",
        editing: editMode,
        story: story,
        isAuthenticated: req.session.isLoggedIn,
        isAdmin: req.session.adminUser,
      });
    })
    .catch((err) => console.log(err));
};

/**
 * POST /edit-story
 * Edit Story
 */

exports.postEditStory = (req, res, next) => {
  const storyObj = req.body.storyId;
  const updatedName = req.body.name;
  const updatedDate = req.body.date;
  const updatedDesc = req.body.description;
  const updatedGame = req.body.game;
  const updatedImageUrl = req.body.imageUrl;
  Story.findById(storyObj)
    .then((story) => {
      story.name = updatedName;
      story.date = updatedDate;
      story.description = updatedDesc;
      story.game = updatedGame;
      story.imageUrl = updatedImageUrl;
      return story.save();
    })
    .then((result) => {
      console.log("Updated Story!");
      res.redirect(`/story/${storyObj}`);
    })
    .catch((err) => err);
};

/**
 * POST /delete-story
 * Delete Story
 */

exports.postDeleteStory = (req, res, next) => {
  const storyObj = req.body.storyId;
  //findByIdAndDelete() is a built-in Mongoose function to delete objects
  Story.findByIdAndDelete(storyObj)
    .then((story) => {
      console.log("Deleted Product!");
      res.redirect(`/games/${story.game}`);
    })
    .catch((err) => {
      console.log(err);
    });
};

//********************************** */

// //********* add this as a proper function format and route with an "edit" button */

// //updates a current entry in the MongoDb database
// async function updateStory() {
//   try {
//     const res = await Story.updateOne(
//       //old name
//       { name: "New Story" },
//       //updated to new name
//       { name: "New Story Updated" }
//     );
//     res.n; //Number of documents matched
//     res.nModified; //Number of documents modified
//   } catch (error) {
//     console.log(error);
//   }
// }

// //********* add this as a proper function format and route with a "delete" button */
// //deletes a current entry in the MongoDb database
// async function deleteStory() {
//   try {
//     //deletes the object that contains the referenced object field
//     await Story.deleteOne({ name: "New Story Updated" });
//   } catch (error) {
//     console.log(error);
//   }
// }

// updateStory();
// deleteStory();
