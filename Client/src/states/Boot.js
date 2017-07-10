import Phaser from 'phaser'
import WebFont from 'webfontloader'

var $ = require("jquery");
var player_name = "Guest"
var loadUserReady = false
var loadRepoReady = false

export default class extends Phaser.State {
  init (battle_file, level_file, next_state, extra_parameters) {
    this.battle_file = battle_file
    this.level_file = level_file
    this.next_state = next_state
    this.extra_parameters = extra_parameters
  }

  preload () {
    // $.get("http://localhost:8000/users/no5013", function(data, status){
    //   console.log(data)
    //   game.user = data
    //   loadUserReady = true
    // })
    // $.get("http://localhost:8000/users/no5013/repos", function(data, status){
    //   console.log(data)
    //   game.repos = data
    //   loadRepoReady = true
    // })
    this.load.text("battle_file", this.battle_file)
    this.load.text("level_file", this.level_file);
    this.load.text("vx_chara01_file", './assets/images/vx_chara01.json');
    this.load.image('loaderBg', './assets/images/loader-bg.png')
    this.load.image('loaderBar', './assets/images/loader-bar.png')
  }

  create () {
    var level_text, level_data;
    level_text = this.game.cache.getText("level_file");
    level_data = JSON.parse(level_text);

    var battle_text, battle_data;
    battle_text = this.game.cache.getText("battle_file");
    battle_data = JSON.parse(battle_text);

    var vx_chara01_text, vx_chara01_data;
    vx_chara01_text = this.game.cache.getText("vx_chara01_file");
    vx_chara01_data = JSON.parse(vx_chara01_text);

    this.extra_parameters.vx_chara01 = vx_chara01_data

    this.state.start("Loading", true, false, battle_data, level_data, this.next_state, this.extra_parameters);
  }
}
