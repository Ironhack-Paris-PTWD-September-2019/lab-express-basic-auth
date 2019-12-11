const express = require("express");
const router = express.Router();

const bcrypt=require('bcrypt') // une dépendance du projet
const User = require('../models/user.js');



router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post('/signup',function(req,res,next){
  const username = req.body.username;
  const password = req.body.password;
  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({username:username}).then(function(user){
    if (user) {
      res.render('auth/signup', {
        errorMessage :'The usernam already exists'
      });
      return;
    }
    const salt=bcrypt.genSaltSync(10)
    const hashPassword=bcrypt.hashSync(req.body.password,salt)
  
    User.create({
      username: username,
      password: hashPassword
    }).then(function(user){
      res.redirect('/')
    }).catch( err => next(err) )
  }).catch (err => next (err))

})

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

router.get("/logout", (req, res, next) => {
    req.session.destroy((err) => {
      // cannot access session here
      res.redirect("/");
    });
  });

  module.exports = router;