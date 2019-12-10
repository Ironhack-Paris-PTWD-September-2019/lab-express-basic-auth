const express=require('express');
const mongoose=require('mongoose');
const bcrypt= require('bcrypt'); 
const router=express.Router();

const User = require('../models/user.js'); 

router.get('/signup', (req,res,next)=>{

  res.render('auth/signup'); 

});

router.post('/signup', (req,res,next)=>{
  const {username,password} =req.body; 

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
  });

});

router.get('/login', (req,res,next)=>{

  res.render('auth/login'); 

});

router.post('/login', (req,res,next)=>{
  const {username,password} = req.body; 

  if(!username || !password) {
    res.render('/login', {errorM:"You have to fill in Username and Password for login"})
    return;
  }

  User.findOne({username:username}).then(user=>{
    if(!user) {
      res.render('/login', {errorM:"Username or Password Incorrect"}); 
      return;
    }

    if(!bcrypt.compareSync(password,user.password)){
      res.render('/login', {errorM:"You have to fill in Username and Password for login"});
      return;
    }
    req.session.currentUser = user; 
    res.redirect('/');

  }).catch(err=>{
    console.error(err);
    next(err);
  });

});

module.exports= router; 