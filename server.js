var express = require('express')
var app = express();
var port = process.env.PORT || 3000

var bodyParser = require('body-parser');
var OAuth = require('oauth')

var gitRepo = require('./get-repo')
var credential = require('./credential')
var API = require('./API')

// parse application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', function (req, res) {
  // gitRepo.getUserData("b5710546232", function(result){
  //     res.send(result);
  // })
  res.redirect(`${API.authorization_base_url}?client_id=${credential.client_id}&scope=user:email`)
});

app.post('/newuser', function (req, res) {
    var json = req.body;
    gitRepo.getUserData(json.name, function(result){
        res.send(result);
    })
});

app.get('/user', function (req,res) {
  res.send("<h1>HELLO</h1>")
});

app.listen(port, function() {
    console.log('Starting node.js on port ' + port);
});
