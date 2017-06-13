import Phaser from 'phaser'
import WebFont from 'webfontloader'

var $ = require("jquery");
var player_name = "Guest"
var loadUserReady = false
var loadRepoReady = false

export default class extends Phaser.State {
  init () {
    var game = this;
  }

  preload () {
    $.get("http://localhost:8000/users/no5013", function(data, status){
      console.log(data)
      game.user = data
      loadUserReady = true
    })
    $.get("http://localhost:8000/users/no5013/repos", function(data, status){
      game.repos = data
      loadRepoReady = true
    })
  }

  update () {
    console.log(this.loadReady)
    if (loadUserReady&&loadRepoReady) {
      this.state.start('Game')
    }
  }
}
