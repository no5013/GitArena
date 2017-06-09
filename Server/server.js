var express = require('express')
var app = express();
var port = process.env.PORT || 3000

var bodyParser = require('body-parser');
var pug = require('pug');
var path = require('path');

var passport = require('passport');
var GitHubStrategy = require('passport-github2').Strategy;
var session = require('express-session');
var methodOverride = require('method-override');
var partials = require('express-partials');

var gitRepo = require('./get-repo')
var credential = require('./credential')
var API = require('./API')

var GITHUB_CLIENT_ID = "3542efee6daf562d4b08";
var GITHUB_CLIENT_SECRET = "635368358955fded95d64de4eae008cae6952dba";

// parse application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(path.join(__dirname, 'assets')));
app.use(partials());
app.use(methodOverride());
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.set('views', './views');
app.set('view engine', 'pug');

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new GitHubStrategy({
    clientID: credential.client_id,
    clientSecret: credential.client_secret,
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile)
    // User.findOrCreate({ githubId: profile.id }, function (err, user) {
    //   return done(err, user);
    // });
    process.nextTick(function () {

      // To keep the example simple, the user's GitHub profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the GitHub account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));

app.get('/', function(req,res){
  res.render('main', { user: req.user })
})

app.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }),
  function(req, res){
    // The request will be redirected to GitHub for authentication, so this
    // function will not be called.
  });

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

// app.get('/auth/github/callback', function (req,res) {
//   res.render('register', {code: req.param('code'), api_access_token:API.getAccessTokenLink() })
//   request.post(
//     API.getAccessTokenLink(),
//     {json: {
//       "client_id": "3542efee6daf562d4b08",
//       "client_secret": "635368358955fded95d64de4eae008cae6952dba",
//       "code": req.param('code')
//     }},
//     function( error, response, body) {
//       if (!error && response.statusCode == 200) {
//         res.send(body)
//       }
//     }
//
//   )
// });

app.post('/newuser', function (req, res) {
  var json = req.body;
  gitRepo.getUserData(json.name, function(result){
    res.send(result);
  })
});

app.listen(port, function() {
  console.log('Starting node.js on port ' + port);
});
