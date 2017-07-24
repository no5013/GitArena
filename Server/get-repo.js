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
  let githubCli = new GitHubClient({
    baseUri:"https://api.github.com",
    token: process.env.TOKEN_GITHUB_DOT_COM
  }, users, octocat, repo, commit, stat);

  this.getGithubUser = function(username, callback){
    githubCli.fetchUser({handle: username})
    .then(result => {
      userData = {
        username: result['login'],
        avatar_url: result['avatar_url'],
        public_repos: result['public_repos'],
        followers: result['followers']
      }
      callback(userData)
    })
  }

  this.getGithubUserRepos = function(username, callback){
    githubCli.fetchUserRepositories({handle: username})
    .then(result => {
      repos = []
      result.forEach(function(repo, index, array){
        var repoData = {
          repo_name: repo['name'],
          fork: repo['fork'],
          stargazers_count: repo['stargazers_count'],
          watchers_count: repo['watchers_count'],
          language: repo['language'],
          open_issue_count: ['open_issue_count']
        }
        repos.push(repoData)
      })

      callback(repos)
    })
  }

  this.getGithubUserReposs = function(username, callback){
    githubCli.fetchUserRepositories({handle: username})
    .then(result => {
      repos = []
      re_repos = []
      error = false
      var repos_length = result.length
      console.log(repos_length)
      result.forEach(function(repo, index, array){
        // check if repo is not empty
        if(repo['language']!=null && !repo['fork']){
          githubCli.fetchRepoStats({owner: username, repository: repo['name']})
          .then(result => {
            if(!(result instanceof Array)){
              console.log("GIT BUG")
              error = true
              repos_length-=1
            }

            //find match collaborator
            for(let i=0; i<result.length; i++){
              if(result[i].author.login == username){

                //calculate added and deleted
                var a=0
                var d=0
                for(let j=0; j<result[i].weeks.length; j++){
                  a += result[i].weeks[j].a
                  d += result[i].weeks[j].d
                }

                //format the update data
                repos.push({
                  repo_name: repo['name'],
                  updated_at: repo['pushed_at'],
                  stargazers_count: repo['stargazers_count'],
                  watchers_count: repo['watchers_count'],
                  language: repo['language'],
                  open_issues_count: repo['open_issues_count'],
                  forks_count: repo['forks_count'],
                  commits_count: result[i].total,
                  added_count: a,
                  deleted_count: d
                })
                break;
              }

              //if user doesn't collaborate in this repo
              if(i == result.length-1){
                repos_length-=1
              }
            }
            console.log(repo['name']+": "+ repos.length + " / " + repos_length)
            if(repos.length == repos_length){
              callback({
                repos: repos,
                error: error
              })
              // callback(repos)
            }
          })
        }else{
          console.log(repo['name'] + " ERROR")
          repos_length-=1
          if(repos.length == repos_length){
            callback({
              repos: repos,
              error: error
            })
            // callback(repos)
          }
        }

      })

    })
  }
}

module.exports = new GitGetter();
