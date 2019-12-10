const express=require('express');
const mongoose=require('mongoose');
const router=express.Router();

const User = require('../models/user.js'); 

//middleware to check authentication 

function ensureIsLogged(req, res, next) {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/login");
  }
}

router.get('/private', ensureIsLogged, (req,res,next)=>{
  res.render('protected/private', {
    user: req.session.currentUser.username
  });
})

module.exports= router; 