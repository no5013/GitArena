import Phaser from 'phaser'
import WebFont from 'webfontloader'

var $ = require("jquery");
var player_name = "Guest"
var loadUserReady = false
var loadRepoReady = false

export default class extends Phaser.State {
  init (battle_file, next_state, extra_parameters) {
    this.battle_file = battle_file
    // this.level_file = level_file
    this.next_state = next_state
    this.extra_parameters = extra_parameters
  }

  preload () {
    this.load.text("battle_file", this.battle_file)
    // this.load.text("level_file", this.level_file)

    this.load.image('loaderBg', './assets/images/loader-bg.png')
    this.load.image('loaderBar', './assets/images/loader-bar.png')
  }

  create () {
    // var level_text, level_data;
    // level_text = this.game.cache.getText("level_file");
    // level_data = JSON.parse(level_text);

    var battle_text, battle_data;
    battle_text = this.game.cache.getText("battle_file");
    battle_data = JSON.parse(battle_text);

    this.state.start("Loading", true, false, battle_data, this.next_state, this.extra_parameters);
  }
}
