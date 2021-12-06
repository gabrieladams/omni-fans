require('./models.js');
var controller = require('./controllers.js');

var auth = require('../passport')();

//controller.request([auth.authenticate()]);


module.exports = controller;