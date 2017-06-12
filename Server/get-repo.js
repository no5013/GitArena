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
      // var itemsProcessed = 0;
      result.forEach(function(repo, index, array){
        // itemsProcessed++;
        // console.log(itemsProcessed)
        // githubCli.getRepositoryLanguages({owner: username, repository: repo['name']})
        // .then(result2 => {
        //   repoData = {
        //     repo_name: repo['name'],
        //     fork: repo['fork'],
        //     stargazers_count: repo['stargazers_count'],
        //     watchers_count: repo['watchers_count'],
        //     language: result2,
        //     open_issue_count: ['open_issue_count']
        //   }
        //   repos.push(repoData)
        // })

        // if(itemsProcessed === array.length) {
        //   callback(repos);
        // }

        repoData = {
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
}

module.exports = new GitGetter();
