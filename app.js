'use strict';

var express = require('express');
var app = express();
var routes = require("./routes")
var logger = require("morgan");

var jsonParser = require("body-parser").json;

app.use(logger("dev"));
app.use(jsonParser());

app.use("/questions", routes);

//404 error handler
app.use((req, res, next) => {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

//Custom Error Handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
      error: {
        message: err.message
      }
  });
});

var port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log("Express server is listening on port", port);
});
