var express = require('express');
var router = express.Router();

var gitRepo = require('../get-repo')

var users = require('../models/units');

router.get('/', function(req, res) {
  users.getAllUnits(function(result){
    res.send(result)
  })
});

// router.get('/:id', function(req, res) {
//   users.getSingleUser(req.params.id, function(result){
//     res.send(result)
//   })
// });

router.post('/register/:id', function(req, res) {
  gitRepo.getGithubUser(req.body.username, function(data){
    console.log(data)
    users.createNewUser(req.body.username, function(result){
      res.json({msg: 'done', result: result})
    })
  });
});

module.exports = router;
