const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/logout', (req, res, next) => {
  req.session.destroy(function () {
    console.log('destroyed!');
    res.send('destroyed!');
  })
})

module.exports = router;
