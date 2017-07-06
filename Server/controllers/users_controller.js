var express = require('express');
var router = express.Router();

var gitRepo = require('../get-repo')

var users = require('../models/users');

router.get('/', function(req, res) {
  users.getAllUsers(function(result){
    res.send(result)
  })
});

// router.get('/:id', function(req, res) {
//   users.getSingleUser(req.params.id, function(result){
//     res.send(result)
//   })
// });

router.post('/new', function(req, res) {
  gitRepo.getGithubUser(req.body.username, function(data){
    console.log(data)
    users.createNewUser(req.body.username, function(result){
      res.json({msg: 'done', result: result})
    })
  });
});

router.post('/', function(req, res) {

  var cus = {
    name: req.body.name,
    face: req.body.face,
    shipName: req.body.shipName,
    email: req.body.email,
    addr: req.body.addr,
    img: "google"
  }

  console.log(cus);

  customer.addCustomerToShop(req.session.shopId,cus,function(result) {
    return res.json({msg: 'done' , insertId: result.insertId} )
  });
});

module.exports = router;
