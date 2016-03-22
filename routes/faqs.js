var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  if (req.user!=null){
    res.render('faqs', { title: 'Zeta Psi | Nu CWRU' , user: req.user.info});
  }else{
    res.render('faqs', { title: 'Zeta Psi | Nu CWRU'});
  }
});

module.exports = router;
