const express=require('express');
const mongoose=require('mongoose');
const router=express.Router();

const User = require('../models/user.js'); 

router.get('/main', (req,res,next)=>{
  res.render('main');
})

module.exports= router; 