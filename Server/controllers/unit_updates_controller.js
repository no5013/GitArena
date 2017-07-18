var express = require('express');
var router = express.Router();

var gitRepo = require('../get-repo')

var units = require('../models/unit_updates');

router.get('/', function(req, res) {
  units.getAllUnitUpdates(function(result){
    res.send(result)
  })
});

router.get('/:id', function(req, res) {
  units.getSingleUnitUpdate(req.params.id, function(result){
    res.send(result)
  })
});

module.exports = router;
