const authorization_base_url = 'https://github.com/login/oauth/authorize'
const token_url = 'https://github.com/login/oauth/access_token'
const scope = 'user:email%20public_repo'

var credential = require('./credential')

function getGithubIdentityLink(){
  return `${authorization_base_url}?client_id=${credential.client_id}&scope=${scope}`
}

function getAccessTokenLink(){
  return token_url
}

module.exports = {
  getGithubIdentityLink: getGithubIdentityLink,
  getAccessTokenLink: getAccessTokenLink
}
