'use strict';

var express = require("express");
var router = express.Router();
var Question = require("./models").Question;

router.param("qID", function(req, res, next, id) {
  Question.findById(id, function(err, doc){
    if(err) return next(err);
    if(!doc) {
      err = new Error("Not Found")
      err.status = 404;
      return next(err);
    }
    req.question = doc;
    return next();
  });
});

router.param("aID", function(req, res, next, id) {
  req.answers = req.question.answer.id(id);
  if(!req.answer) {
    err = new Error("Not Found")
    err.status = 404;
    return next(err);
  }
  next();
});

//GET /questions
//Route for all
router.get("/", (req, res, next) => {
  Question.find({}).sort({createdAt: -1}).exec((err, questions) => {
    if (err) return next(err);
    res.json(questions);
  });
});

//Post /questions
//Route for Posting questions
router.post("/", (req, res, next) => {
  var question = new Question(req.body);
  question.save(function(err, question){
    if(err) return next(err);
    res.status(201);
    res.json(question);
  });
});

//GET /questions/:qID
//Route for questions
router.get("/:qID", (req, res, next) => {
    res.json(req.question);
});

//Post /questions/:qID/answers
//Route for creating answer
router.post("/:qID/answers", (req, res, next) => {
  req.question.answers.push(req.body);
  req.question.save(function(err, question){
    if(err) return next(err);
    res.status(201);
    res.json(question);
  });
});

//Put /questions/:qID/answers/:aID
//Update an answer
router.put("/:qID/answers/:aID", (req, res) => {
  req.answer.update(req.body, function(err, result){
    if(err) return next(err);
    res.json(result)
  });
});

//Delete /questions/:qID/answers/:aID
//Delete an answer
router.delete("/:qID/answers/:aID", (req, res) => {
  req.answer.remove(function(err){
    req.question.save(function(err, question){
      if(err) return next(err);
      res.json(question);
    });
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
    req.vote = req.params.dir;
    next();
  }
}, (req, res, next) => {
    req.answer.vote(req.vote, function(err, question){
      if(err) return next(err);
      res.json(question);
    });
});


module.exports = router;
