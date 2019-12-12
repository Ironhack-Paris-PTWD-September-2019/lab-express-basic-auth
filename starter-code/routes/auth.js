const express = require("express");
const router = express.Router();

const User = require('../models/user');

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get("/signup", (req, res, next) => {
  res.render("signup");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  
  if (username === "" || password === "") {
    res.render("signup", {
      errorMessage: "METS UN TRUC NON VIDE GROS BETA"
    });
    return;
  }

  User.findOne({"username": username})
    .then(user => {
      if (user){
        res.render("signup", {
          errorMessage: "IL Y A DEJA QUELQU'UN QUI S'APPELLE COMME TOI"
        })
        return;
      }
    }).catch(err => next(err));

  const hPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(bcryptSalt));

  User.create({
    username,
    password: hPassword
  }).then(() => {
    res.redirect('/');
  }).catch(err => next(err));
});

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.post("/login", (req, res, next) => {
  const theUsername = req.body.username;
  const thePassword = req.body.password;

  if (theUsername === "" || thePassword === "") {
    res.render("login", {
      errorMessage: "Remplis quand même les deux champs fille / fils à personne"
    });
    return;
  }

  User.findOne({ "username": theUsername })
  .then(user => {
      if (!user) {
        res.render("login", {
          errorMessage: "Qui es tu ? D'ou viens tu ?"
        });
        return; // STOP
      }
      if (bcrypt.compareSync(thePassword, user.password)) {
        req.session.currentUser = user; // Save the user in the session!
        res.redirect("/");
      } else {
        res.render("login", {
          errorMessage: "Louped"
        });
      }
  })
  .catch(err => next(err))
});

router.get('/main', (req, res, next) => {
  res.render("main");
})

module.exports = router;
