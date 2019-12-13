const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "C'est quoi ton blaze et ton mdp petit ?"
    });
    return;
  }

  User.findOne({ username: username }).then(user => {
    if (user) {
      res.render("auth/signup", {
        errorMessage:
          "On dirait que je te connais déjà, vas voir ailleurs bonhomme"
      });
    }

    // Let's hash the password
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    User.create({
      username,
      password: hashPass
    })
      .then(() => {
        res.redirect("/");
      })
      .catch(err => next(err));
  });
});

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", (req, res, next) => {
  const theUsername = req.body.username;
  const thePassword = req.body.password;

  if (theUsername === "" || thePassword === "") {
    res.render("auth/login", {
      errorMessage: "T'es qui man, dis moi TOUT"
    });
    return;
  }

  User.findOne({ username: theUsername })
    .then(user => {
      if (!user) {
        res.render("auth/login", {
          errorMessage: "No consco, jte connais pas bonhomme"
        });
        return;
      }
      if (bcrypt.compareSync(thePassword, user.password)) {
        req.session.currentUser = user;
        res.redirect("/private");
      } else {
        res.render("auth/login", {
          errorMessage: "Incorrect password"
        });
      }
    })
    .catch(err => next(err));
});

function ensureIsLogged(req, res, next) {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/login");
  }
}

router.get("/private", ensureIsLogged, (req, res, next) => {
  res.render("private");
});

router.get("/emocat", ensureIsLogged, (req, res, next) => {
  res.render("emocat");
});

module.exports = router;
