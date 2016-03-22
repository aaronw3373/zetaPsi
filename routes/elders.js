var express = require('express');
var router = express.Router();
var Brother= require('../models/brother.js');


/* GET users listing. */
// default dad
default_dad = {
  name: "Matthew Castner",
  picture: "/images/S.C_2015/Matthew%20Castner_2015.png"
}
router.get('/', function(req, res, next) {
  Brother.find({"position" :"House Dad"}).sort({"updated_at": -1}).exec(function(err,dads){
    if (err) {
      console.log(err);
      res.sendStatus(400);
    }
    else{
      if (req.user!=null){
        res.render('elders', { title: 'Zeta Psi | Nu CWRU' , user: req.user.info, dad:dads[0] || default_dad});
      }else{
        res.render('elders', { title: 'Zeta Psi | Nu CWRU', dad:dads[0] || default_dad});
      }
    }
  });
});

module.exports = router;
