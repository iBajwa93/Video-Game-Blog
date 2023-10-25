const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const fileUpload = require("express-fileupload");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const path = require("path");

const cookieParser = require("cookie-parser");
//all previous dependencies are needed in order to use connect-flash
const flash = require("connect-flash");
const dotenv = require("dotenv").config(); //dotenv file stores the database and port details in string form (without the quotations)

const app = express();

const port = process.env.PORT || 5000; //if hosting to a server, remove the || 3000 and keep the process.env.PORT

const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: "sessions",
});

app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce"))
);
app.use(express.urlencoded({ extended: true })); //helps pass url encoded body
app.use(express.static("public")); //allows us to retrieve folders/files in the public folder such as CSS
app.use(expressLayouts); //

app.use(cookieParser("VideoGameBlogSecure"));
app.use(
  session({
    secret: "VideoGameBlogSecretSession",
    resave: true,
    saveUninitialized: true,
    store: store,
  })
);
app.use(flash());
app.use(fileUpload());

//main.ejs is a layout template that is going to be reused on any other ejs page
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

/**
 *storyRoutes and all dependencies requires name change
 */

const adminRoutes = require("./server/routes/adminRoutes.js");
const blogRoutes = require("./server/routes/blogRoutes.js");
const authRoutes = require("./server/routes/auth.js");

app.use("/admin", adminRoutes);
app.use("/", blogRoutes);
app.use(authRoutes);

mongoose
  .connect(process.env.MONGODB_URI)
  .then((result) => {
    console.log(`Listening to port ${port}`);
    app.listen(port);
  })
  .catch((err) => {
    console.log(err);
  });
