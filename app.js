'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
var db = require('./db/db.js')();

module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 10010;
  app.listen(port);

});
