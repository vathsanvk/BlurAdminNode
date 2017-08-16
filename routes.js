//var mainController = require('./server/controllers/mainController');
module.exports = function(app) {

	// server routes ===========================================================
	// handle things like api calls
	// authentication routes

	// frontend routes =========================================================
	// route to handle all angular requests

	app.get('/', function(req, res, next) {
    res.sendFile(req.app.get("views_path")+"index.html");
  });




};
