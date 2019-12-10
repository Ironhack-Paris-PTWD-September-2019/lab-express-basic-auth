const express = require(`express`);
const router = express.Router();
const User = require(`../models/user`);

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get(`/signup`, (req,res,next) => {
  res.render(`auth/signup`)
})

router.post(`/signup`, (req,res,next) => {
  const { username, password } = req.body;

  if(username.length <= 0 || password <= 0) {
    res.render(`auth/signup`, {
      errorMessage: `Indicate a username and a password to sign up`
    });
    return;
  }

  User.findOne({ username: username })
  .then(user => {
    if(user) {
      res.render(`auth/signup`, {
        errorMessage: `Username is already taken`
      });
      return;      
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
  
    User.create({
      username,
      password: hashPass
    })
    .then(
      res.redirect(`/`)
    )
    .catch(err => next(err))
  })
  .catch(err => next(err))  
})

module.exports = router;