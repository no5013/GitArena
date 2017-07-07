var express = require('express');
var router = express.Router();

var gitRepo = require('../get-repo')

var users = require('../models/users');

router.get('/', function(req, res) {
  users.getAllUsers(function(result){
    res.send(result)
  })
});

router.get('/:id', function(req, res) {
  users.getSingleUser(req.params.id, function(result){
    res.send(result)
  })
});

router.post('/new', function(req, res) {
  console.log(req.body)
  gitRepo.getGithubUser(req.body.username, function(data){
    console.log(data)
    users.createNewUser(req.body.username, function(result){
      res.json({msg: 'done', result: result})
    })
  });
});

module.exports = router;
