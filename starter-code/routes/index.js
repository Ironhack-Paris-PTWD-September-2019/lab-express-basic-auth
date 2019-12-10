const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/signup', (req, res, next) => {
  res.render('signup');
});

router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const bcryptSalt = 10
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const cryptedPwd = bcrypt.hashSync(password, salt);
  if (username === "" || password === "") {
    res.render("signup", {
      errormsg: "Please fill in a username and a password to sign up"
    });
    return;
  }
  
  User.findOne({ "username": username })
    .then(user => {
      if (user) {
        res.render("signup", {
          errormsg: "That username is already taken"
        });
        return;
      }

      // else

      User.create({
        username,
        password: cryptedPwd
      })
        .then(() => {
          res.render("index", {signupmsg: 'Account created'});
        })
        .catch(err => next(err))
      ;
    });

  
});

router.post("/login", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username === "" || password === "") {
    res.render("login", {
      errorMessage: "Please enter username and password to sign in."
    });
    return;
  }

  User.findOne({ "username": username })
  .then(user => {
      if (!user) {
        res.render("login", {
          errormsg: "Incorrect username/password"
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        //req.session.currentUser = user; // not working
        res.render("index", {signupmsg: 'You are logged in'});
      } else {
        res.render("login", {
          errormsg: "Incorrect username/password"
        });
      }
  })
  .catch(err => next(err))
});

module.exports = router;