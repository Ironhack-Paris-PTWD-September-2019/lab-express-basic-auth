const express = require("express");
const router = express.Router();

const bcrypt = require('bcryptjs');
const User = require('../models/user.js');



router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post('/signup', function (req, res, next) {
  if (req.body.username.length <= 0 || req.body.password.length <= 0) {
    // re-rendre le formulaire avec une erreur
    res.render('auth/signup', {
      errorMessage: 'username et password ne peuvent etre vides'
    })
    return; // STOP
  }

  User.findOne({username: req.body.username}).then(function (user) {
    if (user) {
      // Si user avec meme username : Probleme
      res.render('auth/signup', {
        errorMessage: 'ce username existe deja'
      });
      return;
    }

    // 
    // mon username n'existe pas en base
    //

    const salt = bcrypt.genSaltSync(10);
    const hassPassword = bcrypt.hashSync(req.body.password, salt);

    User.create({
      username: req.body.username,
      password: hassPassword
    }).then(function (user) {
      res.redirect('/');
    }).catch(function (err) {
      next(err);
    })
  }).catch(err => next(err))

});

router.get("/login", (req, res, next) => {
    res.render("auth/login");
  });

  router.post("/login", (req, res, next) => {
    const theUsername = req.body.username;
    const thePassword = req.body.password;
  
    if (theUsername === "" || thePassword === "") {
      res.render("auth/login", {
        errorMessage: "Please enter both, username and password to sign up."
      });
      return;
    }
  
    User.findOne({ "username": theUsername })
    .then(user => {
        if (!user) {
          res.render("auth/login", {
            errorMessage: "The username doesn't exist."
          });
          return; // STOP
        }
        if (bcrypt.compareSync(thePassword, user.password)) {
          req.session.currentUser = user; // Save the user in the session!
          res.redirect("/");
        } else {
          res.render("auth/login", {
            errorMessage: "Incorrect password"
          });
        }
    })
    .catch(err => next(err))
  });

module.exports = router;