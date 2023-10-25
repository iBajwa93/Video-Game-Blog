const bcrypt = require("bcryptjs");

const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
    isAdmin: false,
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
    isAdmin: false,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.redirect("/login");
      }
      const taxes = user.password;
      console.log(taxes);
      //entered user password will try to match the encrypted password using bcrypt method .compare()
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          //if true
          if (doMatch) {
            //session stores a cookie value on the server side rather than the client-side, making it more secure
            //sessions are created with default values below
            req.session.isLoggedIn = true;
            req.session.user = user;
            //if the logged in user is an admin then the adminUser session will become true
            if ((user.adminStatus = "true")) {
              req.session.adminUser = true;
            } else if ((user.adminStatus = "false")) {
              req.session.adminUser = false;
            }
            //.save() will make sure the above operations have run first, before redirecting and rendering a new page,
            //syntax below must be returned because the doMatch callback executes asyncronously which may cause the page to redirect to /login in the middle of its execution
            return req.session.save((err) => {
              console.log(err);
              res.redirect("/");
            });
          }
          //if false
          res.redirect("/login");
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch((err) => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  // const confirmPassword = req.body.confirmPassword;
  //prevents created users from having the same email as an existing user
  User.findOne({ email: email })
    //"if there is an existing user document in the database that uses the same email"
    .then((userDoc) => {
      if (userDoc) {
        return res.redirect("/signup");
      }
      //returned bcrypt package will encrypt the entered password of the user so it is not exposed in the database
      //nested promise below will restrict then() chains to only run if we don't satisfy the if condition above
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            email: email,
            password: hashedPassword,
            //Will be marked as false by default for adminStatus, thus making a normal user
            //in order to make an admin user, you must enter the MongoDB database and input 'true' manually for the adminStatus of the user
            //This will be changed in the future, possibly...
            adminStatus: "false",
          });
          return user.save();
        })
        .then((result) => {
          res.redirect("/login");
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  //destroys session and cookies within it and removes the session from the database
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};
