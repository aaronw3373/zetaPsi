var express = require('express');
var router = express.Router();
var Brother= require('../models/brother.js');
var XLSX = require('xlsx');

var isAuthenticated = function(req, res, next) {
  // if user is authenticated in the session, call the next() to call the next request handler
  // Passport adds this method to request object. A middleware is allowed to add properties to
  // request and response objects
  if (req.isAuthenticated())
    return next();
  // if the user is not authenticated then redirect him to the login page
  res.redirect('/');
}

router.get('/', function(req, res, next) {
  res.redirect("/brothers/active")
});

var execFirst = function(bros){
  var pres;
  var vp;
  var sec;
  var corrSec;
  var hist;
  var trea;
  var ser;

  for (var i = 0; i < bros.length; ++i) {
    if(bros[i].position =="President"){
      pres=bros[i];
      bros.splice(i,1);
      i--;
    }else if(bros[i].position =="Vice President"){
      vp=bros[i];
      bros.splice(i,1);
      i--;
    }else if(bros[i].position =="Secretary"){
      sec=bros[i];
      bros.splice(i,1);
      i--;
    }else if(bros[i].position =="Corresponding Secretary"){
      corrSec=bros[i];
      bros.splice(i,1);
      i--;
    }else if(bros[i].position =="Historian"){
      hist=bros[i];
      bros.splice(i,1);
      i--;
    }else if(bros[i].position =="Treasurer"){
      trea=bros[i];
      bros.splice(i,1);
      i--;
    }else if(bros[i].position =="Sergeant At Arms"){
      ser=bros[i];
      bros.splice(i,1);
      i--;
    }
  };

  if (ser != null){
    bros.splice(0,0,ser);
  }
  if (hist != null){
    bros.splice(0,0,hist);
  }
  if (corrSec != null){
    bros.splice(0,0,corrSec);
  }
  if (sec != null){
    bros.splice(0,0,sec);
  }
  if (trea != null){
    bros.splice(0,0,trea);
  }
  if (vp != null){
    bros.splice(0,0,vp);
  }
  if (pres != null){
    bros.splice(0,0,pres);
  }
  return bros;
}
/* GET users listing. */
router.get('/:status', function(req, res, next) {
  Brother.find({"status":req.params.status}).sort({"year": 1, "name":1}).exec(function(err,brothers){
    if (err) {
      console.log(err);
      res.sendStatus(400);
    }
    else{
      var bros = execFirst(brothers);

      if (req.user!=null){
        res.render('brothers', { title: 'Zeta Psi | Nu CWRU', brothers:bros, user: req.user.info});
      }else{
        res.render('brothers', { title: 'Zeta Psi | Nu CWRU', brothers:bros});
      }
    }
  })

});

router.post('/new', isAuthenticated, function(req, res, next) {
  if (req.body.name != '' && req.body.year != ''){
    body = {
      name: req.body.name,
      letters: req.body.letters,
      year: req.body.year,
      major: req.body.major,
      email: req.body.email,
      info: req.body.info,
      picture: (req.body.picture == '' ? "/images/default_headshot.jpg": req.body.picture),
      status: req.body.status,
      position: req.body.position
    }
    Brother.create(body,function (err, response){
      if (err) {
        console.log(err);
        res.sendStatus(400);
      }
      else {
        res.redirect("/brothers/active")
      }
    });
  }else{
    res.sendStatus(400);
  }
});

router.post('/update/:id', isAuthenticated, function(req, res, next) {
  body = {
      name: req.body.name,
      letters: req.body.letters,
      year: req.body.year,
      major: req.body.major,
      email: req.body.email,
      info: req.body.info,
      picture: (req.body.picture == '' ? "/images/default_headshot.jpg": req.body.picture),
      status: req.body.status,
      position: req.body.position
    }
  Brother.findOneAndUpdate({'_id' : req.params.id}, body, function (err,response){
    if (err) {
      console.log(err);
      res.sendStatus(400);
    }
    else {
      res.redirect("/brothers/active")
    }
  });
});

router.post('/delete/:id', isAuthenticated, function(req, res, next) {
  Brother.findOneAndRemove({'_id' : req.params.id}).exec(function (err,response){
    if (err) {
      console.log(err);
      res.sendStatus(400);
    }
    else {
      res.redirect("/brothers/active")
    }
  });
});

var createBrother = function(body){
  Brother.create(body,function (err, response){
    if (err) {
      console.log(err);
    }
    else {
      console.log(response.name);
    }
  });
}

router.post('/readFile', function(req, res, next) {
  var workbook = XLSX.readFile(req.body.file);
  var sheetName = workbook.SheetNames[0];
  var sheet = workbook.Sheets[sheetName];
  var cols = ["A","B","C","D","E","F","G","H","I","J"];

  for (var i = 3; i <= 62; i++) {
    body = {
      name: sheet[cols[0]+i].v + " " + sheet[cols[1]+i].v,
      letters: sheet[cols[2]+i] == null ? "": sheet[cols[2]+i].v,
      year: sheet[cols[3]+i] == null ? 2111: sheet[cols[3]+i].v,
      major: sheet[cols[4]+i] == null ? "": sheet[cols[4]+i].v,
      email: sheet[cols[5]+i] == null ? "": sheet[cols[5]+i].v,
      info: sheet[cols[6]+i] == null ? "": sheet[cols[6]+i].v,
      picture: sheet[cols[7]+i] == null ? "/images/default_headshots.jpg": sheet[cols[7]+i].v,
      status: sheet[cols[8]+i].v,
      position: sheet[cols[9]+i] == null ? "none": sheet[cols[9]+i].v
    }
    createBrother(body);
  };

  res.redirect("/brothers/active")
});




module.exports = router;
