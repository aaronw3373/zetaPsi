var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express();
// database connection setup
mongoose.connect(process.env.MONGODBDEP);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Configuring Passport
var passport = require('passport');
var expressSession = require('express-session');
// TODO what is this?
app.use(expressSession({
  resave: false,
  saveUninitialized: false,
  secret: 'zetapsi'
}));
app.use(passport.initialize());
app.use(passport.session());

var flash = require('connect-flash');
app.use(flash());

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

var authRoutes = require('./routes/auth.js')(passport);
app.use('/auth', authRoutes);



var home = require('./routes/index');
var about = require('./routes/about');
var rush = require('./routes/rush');
var brothers = require('./routes/brothers');
var elders = require('./routes/elders');
var composites = require('./routes/composites');
var faqs = require('./routes/faqs');
var contact = require('./routes/contact');

app.use('/', home);
app.use('/about', about);
app.use('/rush', rush);
app.use('/brothers', brothers);
app.use('/elders', elders);
app.use('/composites', composites);
app.use('/faqs', faqs);
app.use('/contact', contact);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
