const express = require('express');
const router  = express.Router();

function ensureIsLogged(req, res, next) {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/login");
  }
}

/* GET home page */
router.get('/', (req, res, next) => {
  let userIsLogged = false;

  if (req.session.currentUser) {
    userIsLogged = true; 
  } 
    
  res.render('index', {
    userIsLogged: userIsLogged
  });
});

/* GET main page */
router.get(`/main`, ensureIsLogged, (req,res,next) => {
  res.render(`main`)
})

/* GET private page */
router.get(`/private`, ensureIsLogged, (req,res,next) => {
  res.render(`private`)
})

module.exports = router;
