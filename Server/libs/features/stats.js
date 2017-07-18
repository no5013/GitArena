/*
# Stats features (only for GitHub Enterprise)

## Setup

```javascript
const GitHubClient = require('../libs/GitHubClient.js').GitHubClient;
const stats = require('../libs/features/stats');


let githubCli = new GitHubClient({
  baseUri: "http://github.at.home/api/v3",
  token: process.env.TOKEN_GHITHUB_ENTERPRISE
}, stats); //<-- add stats features
```
*/

/*
## fetchStats

- parameter: `type` see: https://developer.github.com/v3/enterprise/admin_stats/
- return: `Promise`

### Description

`fetchStats` gets statistics from a type (issues, hooks, ...)

*/
function fetchStats({type}){
  return this.getData({path:`/enterprise/stats/${type}`})
    .then(response => {
      return response.data;
    });
}

function fetchRepoStats({owner,repository}){
  return this.getData({path:`/repos/${owner}/${repository}/stats/contributors`})
    .then(response => {
      return response.data;
    })
}

module.exports = {
  fetchStats: fetchStats,
  fetchRepoStats: fetchRepoStats
};
