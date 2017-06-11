/**
* Get GitHub user informations
*/

const GitHubClient = require('./libs/GitHubClient.js').GitHubClient;
const users = require('./libs/features/users');
const octocat = require('./libs/features/octocat')
const repo = require('./libs/features/repositories')
const commit = require('./libs/features/commits')
const stat = require('./libs/features/stats')

function GitGetter() {

  this.getUserData = function(userName, callback){

    let githubCli = new GitHubClient({
      baseUri:"https://api.github.com",
      token: process.env.TOKEN_GITHUB_DOT_COM
    }, users, octocat, repo, commit, stat);

    githubCli.fetchUserRepositories({handle: userName})
    .then(repos => {
      repos_name = []
      repos.forEach(function(repo){
        repos_name.push(repo['name'])
      })

      callback(repos_name)
      // n = 10
      // repo_name = repos[n]['name']
      // login = repos[n]['owner']['login']
      // data['repo_name'] = repo_name
      // // githubCli.fetchUser({handle: login})
      // //   .then(owner => {
      // //   console.log(owner);
      // //   })
      // //   .catch(error => {
      // //     console.log("error", error)
      // //   });
      // // githubCli.fetchAllCommit({owner: login, repository: repos[0]['name']})
      // //   .then(commits => {
      // //     console.log(commits[0])
      // //   })
      // githubCli.fetchUserStats({owner: login, repository: repo_name})
      // .then(stats => {
      //   console.log(stats[0])
      //   data['stat'] = stats[0]
      // })
      //
      // callback(data)
    })
  }
}

module.exports = new GitGetter();
