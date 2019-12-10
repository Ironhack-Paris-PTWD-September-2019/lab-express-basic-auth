const express=require('express');
const mongoose=require('mongoose');
const bcrypt= require('bcrypt'); 
const router=express.Router();

const User = require('../models/user.js'); 

router.get('/signup', (req,res,next)=>{

  res.render('auth/signup'); 

});

router.post('/signup', (req,res,next)=>{
  const username=req.body.username; 
  const password=req.body.password;

  if(!username || !password){
    res.render('auth/signup', {errorM:"You have to enter a Username and a Password"})
    return; 
  }

  User.findOne({username:username}).then((user)=>{
    if(user){
      res.render('auth/signup', {errorM:`Username ${username} is already taken`});
      return;
    }

    const salt=bcrypt.genSaltSync(12); 
    const hashPassword=bcrypt.hashSync(password,salt); 

    User.create({
      username:username, 
      password:hashPassword
    }).then(user=>{
      res.redirect('/');

    }).catch(err=>{
      console.error(err, "User was not created in DB");
      next(err);
    })

  }).catch(err=>{
    console.error(err);
    next(err);
  })

});

module.exports= router; 