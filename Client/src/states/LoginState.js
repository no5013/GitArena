/* globals __DEV__ */
import TextPrefab from '../prefabs/TextPrefab'
import PhaserInput from '../libs/phaser-input'
import { centerGameObjects } from '../utils'

var $ = require("jquery");

export default class extends Phaser.State {

  init () {
    this.game.add.plugin(PhaserInput.Plugin);
    this.prefabs = {}
    this.groups = {
      hud: this.game.add.group()
    }
  }

  preload () {
  }

  create () {
    this.TEXT_STYLE = {font: "30px Arial", fill: "#FFFFFF"}
    this.HUD_TEXT_STYLE = {font: "16px Arial", fill: "#FFFFFF"}

    this.username = game.add.inputField(this.game.world.centerX-75, this.game.world.centerY, {
      font: '18px Arial',
      fill: '#212121',
      fontWeight: 'bold',
      width: 150,
      padding: 8,
      borderWidth: 1,
      borderColor: '#000',
      borderRadius: 6,
      placeHolder: 'Username',
    });

    this.password = game.add.inputField(this.game.world.centerX-75, this.game.world.centerY + 50, {
      font: '18px Arial',
      fill: '#212121',
      fontWeight: 'bold',
      width: 150,
      padding: 8,
      borderWidth: 1,
      borderColor: '#000',
      borderRadius: 6,
      placeHolder: 'Password',
      type: PhaserInput.InputType.password
    });

    var login_button = new TextPrefab(this, "login_button", {x: this.game.world.centerX ,y: this.game.world.centerY + 120},  {group: "hud", text: "LOGIN", style: Object.create(this.TEXT_STYLE)})
    login_button.anchor.setTo(0.5)
    login_button.inputEnabled = true
    login_button.events.onInputDown.add(this.login, this)
  }

  login(){
    let self = this
    var username = this.username.value
    var password = this.password.value
    $.get(`http://localhost:8000/users/${username}`, function(data, status){
      console.log(data)
      game.user = data
      $.get(`http://localhost:8000/users/${username}/repos`, function(data, status){
        console.log(data)
        game.repos = data

        self.state.start('MainMenu')
      })
    })
  }

  render () {

  }
}
