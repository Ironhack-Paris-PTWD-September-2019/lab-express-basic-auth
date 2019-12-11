const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

function ensureIsLogged(req, res, next) {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/login");
  }
}

router.get("/main", ensureIsLogged, (req, res, next) => {
  res.render("main");
});

router.get("/private", ensureIsLogged, (req, res, next) => {
  res.render("private");
});

module.exports = router;
