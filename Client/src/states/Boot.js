import Phaser from 'phaser'
import WebFont from 'webfontloader'

var $ = require("jquery");
var player_name = "Guest"
var loadReady = false

export default class extends Phaser.State {
  init () {
    var game = this;
  }

  preload () {
    $.get("http://localhost:8000/user/no5013", function(data, status){
      console.log(data)
      game.players = data
      loadReady = true
    })
  }

  update () {
    console.log(this.loadReady)
    if (loadReady) {
      this.state.start('Game')
    }
  }
}
