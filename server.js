var express = require('express')
var app = express();
var port = process.env.PORT || 7777

var bodyParser = require('body-parser');

var gitRepo = require('./get-repo')

// parse application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', function (req, res) {
  gitRepo.getUserData("b5710546232", function(result){
      res.send(result);
  })
});

app.post('/newuser', function (req, res) {
    var json = req.body;
    gitRepo.getUserData(json.name, function(result){
        res.send(result);
    })
});

app.listen(port, function() {
    console.log('Starting node.js on port ' + port);
});
