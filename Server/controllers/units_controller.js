var express = require('express');
var router = express.Router();

var gitRepo = require('../get-repo')

var units = require('../models/units');
var users = require('../models/users');

router.get('/', function(req, res) {
  units.getAllUnits(function(result){
    res.send(result)
  })
});

router.get('/:id', function(req, res) {
  units.getSingleUnit(req.params.id, function(result){
    res.send(result)
  })
});

router.post('/register', function(req, res) {
  var user_id = req.body.user_id
  users.getSingleUser(user_id, function(user_data){
    gitRepo.getGithubUserRepos(user_data.name, function(repos){
      repos.forEach(function(repo){
        if(!repo.fork){
          units.createNewUnit(user_id, repo.repo_name, repo.language, repo.stargazers_count, repo.watchers_count, function(result){
            console.log("create unit")
          })
        }
      })
      // res.json({msg: 'done', result: result})
      res.send(repos)
    });
  })
});

module.exports = router;
