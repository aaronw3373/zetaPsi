var express = require('express');
var router = express.Router();
var Brother= require('../models/brother.js');

default_contacts ={
  web: {
    name: "Aaron Weinberg",
    email: "aaw66@case.edu"
  },
  recruitment: {
    name: "Jamie Catalan",
    email: "jamie.taco.catalan@gmail.com"
  },
  president: {
    name: "Tyler Clarkson",
    email: "t.clarkson.19483@gmail.com"
  }
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  Brother.find({"status":"active"}).or([{"position":"President"},{"position":"Recruitment Chair"},{"position":"Web Chair"}]).sort({"updated_at":-1}).exec(function(err, people){
    if (err) {
      console.log(err);
      res.sendStatus(400);
    }
    else{
      var recs = [];
      var webs = [];
      var pres = [];
      for (var i = 0; i < people.length; i++) {
        if(people[i].position =="President"){
          pres.push(people[i]);
        }
        else if(people[i].position =="Recruitment Chair"){
          recs.push(people[i]);
        }
        else if(people[i].position =="Web Chair"){
          webs.push(people[i]);
        }
      };
      presCurrent = 0;
      recsCurrent = 0;
      websCurrent = 0;
      for (var i = 0; i < pres.length; i++) {
        if (pres[i].updated_at > pres[presCurrent].updated_at){
          presCurrent = i;
        }
      }
      for (var i = 0; i < recs.length; i++) {
        if (recs[i].updated_at > recs[recsCurrent].updated_at){
          recsCurrent = i;
        }
      }
      for (var i = 0; i < webs.length; i++) {
        if (webs[i].updated_at > webs[websCurrent].updated_at){
          websCurrent = i;
        }
      }
      contact = {
        web: webs[websCurrent] || default_contacts.web,
        recruitment: recs[recsCurrent] || default_contacts.recruitment,
        president: pres[presCurrent] || default_contacts.president
      }
      if (req.user!=null){
        res.render('contact', { title: 'Zeta Psi | Nu CWRU' , user: req.user.info, people:contact});
      }else{
        res.render('contact', { title: 'Zeta Psi | Nu CWRU', people: contact});
      }
    }
  })
});

module.exports = router;
