// modules =================================================
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');
var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var path         = require('path');
//var mongoose     = require('mongoose');

// configuration ===========================================

// config files
var env          = process.env.NODE_ENV || 'development';
//var config       = require('./config/db')[env];
//var db = require('./config/db');
var port = process.env.PORT || 3000; // set our port
/*mongoose.Promise = global.Promise;
mongoose.connect(config.db);
mongoose.connection.on('error', function() {
  console.error('MongoDB Connection Error. Please make sure that MongoDB is running.');
});*/
// view engine setup
app.set('views_path',path.join(__dirname,'server/views',path.sep));
//app.set('views', path.join(__dirname, 'server/views'));
//app.set('view engine', 'ejs');
// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users
/*app.use(session({
  cookie:{maxAge :30000 },
  resave: true,
  saveUninitialized: false,
  secret: db.sessionSecret,
})); */
//app.use(flash());
// routes ==================================================
require('./routes')(app); // pass our application into our routes

// start app ===============================================
app.listen(port);
console.log('Magic happens on port ' + port); 			// shoutout to the user
exports = module.exports = app; 						// expose app
