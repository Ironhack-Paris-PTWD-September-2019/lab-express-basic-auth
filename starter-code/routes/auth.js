const express = require("express");
const router = express.Router();

const bcrypt = require('bcrypt');
const User = require('../models/user.js');

// SIGN UP
router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post('/signup', (req, res, next) => {
  if (req.body.username === "" || req.body.password === "") {
    res.render('auth/signup', {
      errorMessage: "Indicate a username and a password to sign up"
    })
    return;
  }

  User.findOne({username: req.body.username}).then(user => {
    if (user) {
      res.render('auth/signup', {
        errorMessage: "The username already exists!"
      })
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hassPassword = bcrypt.hashSync(req.body.password, salt);
    
    User.create({
      username: req.body.username,
      password: hassPassword
    }).then(user => {
      res.redirect('/main');
    }).catch(err => next(err))
  }).catch(err => next(err));
});

//LOGIN
router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", (req, res, next) => {

  if (req.body.username === "" || req.body.password === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both, username and password to sign up."
    });
    return;
  }

  User.findOne({ "username": req.body.username })
  .then(user => {
      if (!user) {
        res.render("auth/login", {
          errorMessage: "The username doesn't exist."
        });
        return; // STOP
      }
      if (bcrypt.compareSync(req.body.password, user.password)) {
        req.session.currentUser = user; // Save the user in the session!
        res.redirect("/main");
      } else {
        res.render("auth/login", {
          errorMessage: "Incorrect password"
        });
      }
  })
  .catch(err => next(err))
});



module.exports = router;