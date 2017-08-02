/* globals __DEV__ */
import TextPrefab from '../prefabs/TextPrefab'
import PhaserInput from '../libs/phaser-input'
import Prefab from '../prefabs/Prefab'
import { centerGameObjects } from '../utils'

var $ = require("jquery");

export default class extends Phaser.State {

  init (login_data, extra_parameters) {
    this.game.add.plugin(PhaserInput.Plugin);
    this.login_data = login_data
    console.log(login_data)
  }

  preload () {
  }

  create () {
    // create groups
    this.groups = {};
    this.login_data.groups.forEach(function (group_name) {
      this.groups[group_name] = this.game.add.group();
    }, this);

    // create prefabs
    this.prefabs = {};
    for (let prefab_name in this.login_data.prefabs) {
      if (this.login_data.prefabs.hasOwnProperty(prefab_name)) {
        console.log(prefab_name)
        // create prefab
        this.createPrefab(prefab_name, this.login_data.prefabs[prefab_name]);
      }
    }


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

  createPrefab(prefab_name, prefab_data){
    var prefab;
    console.log("TEST")
    // create object according to its type
    //if (this.prefab_classes.hasOwnProperty(prefab_data.type)) {
      prefab = new Prefab(this, prefab_name, prefab_data.position, Object.create(prefab_data.properties));
    //}
  }

  login(){
    let self = this
    var username = this.username.value
    var password = this.password.value
    // $.get(`http://localhost:8000/users/${username}`, function(data, status){
    //   console.log(data)
    //   game.user = data
    // $.get(`http://localhost:8000/users/${username}/repos`, function(data, status){
    //   console.log(data)
    //   game.repos = data
    //
    //   self.state.start('MainMenu')
    // })
    // })
    $.ajax({
      type: "POST",
      url: "http://localhost:8000/users/authenticate",
      data: JSON.stringify({
        username: username,
        password: password
      }),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(data){
        game.user = data
        $.get(`http://localhost:8000/users/${data.id}/units`, function(data, status){
          console.log(data)
          game.repos = data
          self.state.start('Boot', true, false, "assets/levels/level.json", "MainMenu")
        })
      },
      error: function(err){
        console.log(err)
      }
    })
  }

  render () {

  }
}
