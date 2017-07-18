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
      var repos_length = result.length
      result.forEach(function(repo, index, array){
        var repoData = {
          repo_name: repo['name'],
          fork: repo['fork'],
          stargazers_count: repo['stargazers_count'],
          watchers_count: repo['watchers_count'],
          language: repo['language'],
          open_issue_count: repo['open_issues_count'],
          updated_at: repo['updated_at'],
          forks_count: repo['forks_count']
        }
        console.log(repo)

        // check if repo is not empty
        if(repo['language']!=null){
          githubCli.fetchRepoStats({owner: username, repository: repo['name']})
          .then(result => {
            //find match collaborator
            for(let i=0; i<result.length; i++){
              if(result[i].author.login == username){

                //format weeks
                var a=0
                var d=0
                for(let j=0; j<result[i].weeks.length; j++){
                  a += result[i].weeks[j].a
                  d += result[i].weeks[j].d
                }

                repos.push({
                  repo_name: repo['name'],
                  updated_at: repo['updated_at'],
                  stargazers_count: repo['stargazers_count'],
                  watchers_count: repo['watchers_count'],
                  language: repo['language'],
                  open_issue_count: repo['open_issues_count'],
                  forks_count: repo['forks_count'],
                  commits_count: result[i].total,
                  added_count: a,
                  deleted_count: d
                })
                console.log(repo['name'] + " " + result[i].total)
                break;
              }

              //if user doesn't collaborate in this repo
              if(result.length == i+1){
                repos_length-=1
              }
            }
            // console.log(repos.length + " / " + repos_length)
            if(repos.length == repos_length){
              callback(repos)
            }
          })
        }else{
          console.log(repoData.repo_name + " ERROR")
          repos_length-=1
          if(repos.length == repos_length){
            callback(repos)
          }
        }

      })

    })
  }
}

module.exports = new GitGetter();
