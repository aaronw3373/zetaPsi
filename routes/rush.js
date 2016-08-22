var express = require('express');
var router = express.Router();

var isAuthenticated = function(req, res, next) {
  // if user is authenticated in the session, call the next() to call the next request handler
  // Passport adds this method to request object. A middleware is allowed to add properties to
  // request and response objects
  if (req.isAuthenticated())
    return next();
  // if the user is not authenticated then redirect him to the login page
  res.redirect('/');
}

var rushPic = "/images/Falll2016RushCal.png";
/* GET users listing. */
router.get('/', function(req, res, next) {
  if (req.user!=null){
    res.render('rush', { title: 'Zeta Psi | Nu CWRU' , user: req.user.info, picture: rushPic});
  }else{
    res.render('rush', { title: 'Zeta Psi | Nu CWRU', picture: rushPic});
  }
});

router.post('/newpic', isAuthenticated, function(req, res, next) {
  rushPic = req.body.picture;
  res.redirect("/rush")
});

module.exports = router;
