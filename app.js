'use strict';

var express = require('express');
var app = express();
var routes = require("./routes")
var logger = require("morgan");

var jsonParser = require("body-parser").json;

app.use(logger("dev"));
app.use(jsonParser());

var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/qa");

var db = mongoose.connection;

db.on("error", (err) => {
    console.error("connection error:", err);
});

db.once("open", () => {
    console.log("db connection was succesful");
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  if (req.method === 'Options') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE');
    return res.status(200).json({});
  }
});

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

var port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log("Express server is listening on port", port);
});
