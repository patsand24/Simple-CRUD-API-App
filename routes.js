'use strict';

var express = require("express");
var router = express.Router();

//GET /questions
//Route for all
router.get("/", (req, res) => {
  res.json({response: "You sent me a GET request"});
});

//Post /questions
//Route for Posting questions
router.post("/", (req, res) => {
  res.json({
      response: "You sent me a POST request",
      body: req.body
    });
});

//GET /questions/:qID
//Route for all
router.get("/:qID", (req, res) => {
  res.json({
      response: "You sent me a GET request for ID " + req.params.qID
    });
});

//Post /questions/:qID/answers
//Route for creating answer
router.post("/:qID/answers", (req, res) => {
  res.json({
      response: "You sent me a POST request to /answers",
      questionId: req.params.qID,
      body: req.body
    });
});

//Put /questions/:qID/answers/:aID
//Update an answer
router.put("/:qID/answers/:aID", (req, res) => {
  res.json({
      response: "You sent me a PUT request to /answers",
      questionId: req.params.qID,
      answerId: req.params.aID,
      body: req.body
    });
});

//Delete /questions/:qID/answers/:aID
//Delete an answer
router.delete("/:qID/answers/:aID", (req, res) => {
  res.json({
      response: "You sent me a DELETE request to /answers",
      questionId: req.params.qID,
      answerId: req.params.aID,
    });
});

//Post /questions/:qID/answers/:aID/vote-up
//Post /questions/:qID/answers/:aID/vote-down
//Vote on an answer
router.post("/:qID/answers/:aID/vote-:dir", (req, res, next) => {
  if (req.params.dir.search(/^(up|down)$/) === -1) {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
  } else {
    next();
  }
  }, (req, res) => {
    res.json({
        response: "You sent me a POST request to /vote-" + req.params.dir,
        questionId: req.params.qID,
        answerId: req.params.aID,
        vote: req.params.dir
      });
});


module.exports = router;
