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

app.get('/newuser', function (req, res) {
  res.redirect(API.getGithubIdentityLink())
});

app.post('/newuser', function (req, res) {
    var json = req.body;
    gitRepo.getUserData(json.name, function(result){
        res.send(result);
    })
});

app.get('/user', function (req,res) {
  res.send(`<h1>${req.param('code')}</h1>`)
});

app.listen(port, function() {
    console.log('Starting node.js on port ' + port);
});
