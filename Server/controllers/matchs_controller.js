var express = require('express');
var router = express.Router();

var gitRepo = require('../get-repo')

var users = require('../models/users');
var units = require('../models/units');

router.get('/matchmaking', function(req, res) {
  users.getUsersCount(function(result){
    var random = Math.floor(result.count*Math.random())+1
    random = 8
    users.getSingleUser(random, function(user){
      units.getAllUnitsOfUserWithStatus(random, function(units){
        gitRepo.getGithubUser(user.name, function(user_data_from_git){
          res.send(
            {
              user: user,
              user_data_from_git: user_data_from_git,
              units: units
            }
          )
        });
      })
    })
  })
});

module.exports = router;
