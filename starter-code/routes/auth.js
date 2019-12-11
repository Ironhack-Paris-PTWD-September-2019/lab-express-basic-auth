const express = require('express');
const router  = express.Router();
const User = require('../models/user')
const bcrypt = require('bcrypt')
const bcryptSalt = 10;

/* GET home page */
router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

router.post('/signup' , (req , res , next) => {
  const username = req.body.username;
  const password = req.body.password;
  
  if(username === ""  || password === "") {
    res.render('auth/signup' , {errorMessage : 'veuillez entrer un username et un password!'})
    return
  }
  User.findOne({'username' : username})
    .then(user => {
      if(user) {
        res.render('auth/signup' , {errorMessage : 'user already exist!'})
        return
      }
    })
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password , salt)

  User.create({
    username : username,
    password : hashPass
  })
  .then(user => {
    res.redirect('/')
  })
  .catch(error => {
    next(error)
  })
})

router.get('/login', (req, res, next) => {
  res.render('auth/login');
});

router.post('/login' , (req , res , next) => {
  const username = req.body.username;
  const password = req.body.password;
  if(username === ""  || password === "") {
    res.render('auth/login' , {errorMessage : 'veuillez entrer un username et un password!'})
    return
  }
  User.findOne({'username' : username})
    .then(user => {
      if(!user) {
        res.render('auth/login' , {errorMessage : 'username doesnt exist.'})
        return
      }
      if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect('/')
      }
      else {
        res.render("auth/login", {
          errorMessage: "Incorrect password"
        });
      }
    })
    .catch(error => {
      next(error)
    })
});

module.exports = router;