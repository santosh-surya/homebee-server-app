var express = require('express');
var mongoose = require('mongoose');
var responsive = require('express-responsive');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var oauthserver = require('oauth2-server');
var utils = require('./controllers/utils');
var multer  =   require('multer');

var app = express();

app.locals.appname = "Jungle Bee Working Hard for You"

utils.debug('app starting');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(responsive.deviceCapture());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cookieSession({
    name: 'junglebee',
    path: '/',
    secret: 'ahshshshleieinhdl',
    maxAge: 3600000
}));
app.use(express.static(path.join(__dirname, 'public')));

//oauth2 server integration
app.oauthModel = require('./models/oauth2');
app.oauth = oauthserver({
    model: app.oauthModel,
    grants: ['password', 'refresh_token'],
    debug: true,
    accessTokenLifetime: 3600,
    refreshTokenLifetime: 2592000,
});
//generate tokens
app.all('/1.0/oauth/token', utils.debugApiRequest, app.oauth.grant());

app.use(app.oauth.errorHandler());

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
      // console.log(file)
    callback(null, './public/uploads');
  },
  filename: function (req, file, callback) {
      // console.log(file);
      utils.apidebug("uploading file: " + file.fieldname + '-' + Date.now()+path.extname(file.originalname));
    callback(null, file.fieldname + '-' + Date.now()+path.extname(file.originalname));
  }
});

var upload = multer({ storage : storage});
app.upload = upload;

//add all models to the app object
app.users = require('./models/user');
app.devices = require('./models/device');
app.services = require('./models/service');
app.suppliers = require('./models/supplier');
app.jobs = require('./models/job');
app.sms = require('./models/sms');
app.homebeedevices = require('./models/homebee');
//db connection
var api = require('./routes/route-api');
var admin = require('./routes/route-admin');
var website = require('./routes/route-website');
var homebee = require('./routes/route-homebee');

app.use('/1.0/api', utils.debugApiRequest, app.oauth.authorise(), app.upload.array('files', 10), api);
app.use('/1.0/homebee', utils.debugApiRequest, app.oauth.authorise(), homebee);
// app.use('/1.0/api', app.oauth.authorise(), utils.debugApiRequest, api);
app.use('/admin', admin);
app.use('/', website);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  utils.debug('Not found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
      if (req.path.indexOf('/admin/login') == 0){
          res.render('admin/error', { req: req, userRole: '', username: '', page: 'login', title: 'Error ... ', error: err});
          res.end();
      }else if (req.path.indexOf('/1.0/api/') == 0){
          res.jsonp({code: err.code, error: err.error, error_description: err.error_description});
          res.end();
      } else {
          res.status(err.status || 500);
          res.render('error', {
            message: err.message,
            error: err
          });
      }
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

utils.apidebug(utils.args);
module.exports = app;
