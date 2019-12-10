const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post('/signup', function (req, res, next) {
  if (req.body.username.length <= 0 || req.body.password.length <= 0) {
  
    res.render('auth/signup', {
      errorMessage: 'username et password ne peuvent etre vide'
    })
    return; 
  }

  User.findOne({username: req.body.username}).then(function (user) {
    if (user) {
     
      res.render('auth/signup', {
        errorMessage: 'ce username existe deja'
      });
      return;
    }


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

module.exports = router;