import Phaser from 'phaser'
import WebFont from 'webfontloader'

var $ = require("jquery");
var player_name = "Guest"
var loadUserReady = false
var loadRepoReady = false

export default class extends Phaser.State {
  init (level_file, next_state, extra_parameters) {
    this.level_file = level_file
    this.next_state = next_state
    this.extra_parameters = extra_parameters
  }

  preload () {
    $.get("http://localhost:8000/users/no5013", function(data, status){
      console.log(data)
      game.user = data
      loadUserReady = true
    })
    $.get("http://localhost:8000/users/no5013/repos", function(data, status){
      console.log(data)
      game.repos = data
      loadRepoReady = true
    })
    this.load.text("level1", this.level_file);
  }

  update () {
    if (loadUserReady&&loadRepoReady) {
      var level_text, level_data;
      level_text = this.game.cache.getText("level1");
      level_data = JSON.parse(level_text);
      console.log(level_data)
      this.state.start("Loading", true, false, level_data, this.next_state);
    }
  }
}
