var express = require('express');
var router = express.Router();
var Report = require('../models/report.js');

var isAuthenticated = function(req, res, next) {
  // if user is authenticated in the session, call the next() to call the next request handler
  // Passport adds this method to request object. A middleware is allowed to add properties to
  // request and response objects
  if (req.isAuthenticated())
    return next();
  // if the user is not authenticated then redirect him to the login page
  res.redirect('/');
}


var pics = [
  "/images/1.png",
  "/images/noobs.png",
  "/images/3.png",
  "/images/4.png",
  "/images/phimumixer.png"
]
/* GET home page. */
router.get('/', function(req, res, next) {
  Report.find({}).sort({"date": -1}).exec(function (err, report){
    if (err) {
      console.log(err);
      res.sendStatus(400);
    }
    else {
      if (req.user!=null){
        res.render('index', { title: 'Zeta Psi | Nu CWRU' , user: req.user.info, pics: pics, reports: report});
      }else{
        res.render('index', { title: 'Zeta Psi | Nu CWRU', pics: pics, reports: report});
      }
    }
  });
});

router.post('/newReport', isAuthenticated, function(req, res, next) {
  var str = req.body.body;
  paragraphs = [];
  while (str.search("\r\n") != -1){
    var n = str.search("\r\n");
    var sub = str.substring(0, n);
    paragraphs.push(sub);
    str = str.substring(n+2, str.length);
  };
  paragraphs.push(str);
  console.log(paragraphs);

  body = {
    date:req.body.date,
    title:req.body.title,
    body: paragraphs,
    author: req.body.author
  }
  Report.create(body,function (err, response){
    if (err) {
      console.log(err);
      res.sendStatus(400);
    }
    else {
      res.redirect("/");
    }
  });
});

router.post('/newpic', isAuthenticated, function(req, res, next) {
  pics.push(req.body.pic)
  res.redirect("/");
});


router.post('/removepic/:id', isAuthenticated, function(req, res, next) {
  pics.splice(req.params.id, 1);
  res.redirect("/");
});

router.post('/deletereport/:id', isAuthenticated, function(req, res, next) {
  Report.findOneAndRemove({'_id' : req.params.id}).exec(function (err,response){
    if (err) {
      console.log(err);
      res.sendStatus(400);
    }
    else {
      res.redirect("/");
    }
  });
});

module.exports = router;
