var express = require('express');
var router = express.Router();

var gitRepo = require('../get-repo')

var users = require('../models/users');
var units = require('../models/units');

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

router.get('/:id/repos', function(req,res){
  var user_id = req.params.id
  units.getAllUnitsOfUser(user_id, function(result){
    res.send(result)
  })
})

router.get('/:id/update', function(req,res){
  var user_id = req.params.id
  console.log(user_id)
  units.getAllUnitsOfUsers(user_id, function(result){
    res.send(result)
  })
})

router.post('/authenticate', function(req,res){
  var username = req.body.username
  var password = req.body.password
  users.authenticate(username, password, function(result){
    res.send(result)
  })
})

module.exports = router;
