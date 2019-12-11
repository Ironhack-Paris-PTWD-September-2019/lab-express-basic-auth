const express = require(`express`);
const router = express.Router();
const User = require(`../models/user`);

const bcrypt = require("bcrypt");
const bcryptSalt = 10;


// ######  ####  ######   ##    ## ##     ## ########  
// ##    ##  ##  ##    ##  ###   ## ##     ## ##     ## 
// ##        ##  ##        ####  ## ##     ## ##     ## 
//  ######   ##  ##   #### ## ## ## ##     ## ########  
//       ##  ##  ##    ##  ##  #### ##     ## ##        
// ##    ##  ##  ##    ##  ##   ### ##     ## ##        
//  ######  ####  ######   ##    ##  #######  ##        


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
      res.redirect(`/main`)
    )
    .catch(err => next(err))
  })
  .catch(err => next(err))  
})


// ##        #######   ######   #### ##    ## 
// ##       ##     ## ##    ##   ##  ###   ## 
// ##       ##     ## ##         ##  ####  ## 
// ##       ##     ## ##   ####  ##  ## ## ## 
// ##       ##     ## ##    ##   ##  ##  #### 
// ##       ##     ## ##    ##   ##  ##   ### 
// ########  #######   ######   #### ##    ## 


router.get(`/login`, (req,res,next) => {
  res.render(`auth/login`)
})

router.post(`/login`, (req,res,next) => {
  const { username, password } = req.body;

  if(username.length <= 0 || password.length <= 0) {
    res.render(`auth/login`, {
      errorMessage: `Please fill both username and password inputs`
    });
    return;
  }

  User.findOne({username: username})
  .then(user => {
    if(!user) {
      res.render(`auth/login`, {
        errorMessage: `The username "${username}" does not exist`
      });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    if(bcrypt.compareSync(password, user.password)) {
      req.session.currentUser = user;
      res.redirect(`/main`)
    } else {
      res.render(`auth/login`, {
        username: username,
        errorMessage: `Username and password do not match`
      });
    }
  })
  .catch(err => next(err))
})


module.exports = router;