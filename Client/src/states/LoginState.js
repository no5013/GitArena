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

    //bg layer1 animation
    var bg1_tween_forth = game.add.tween(this.prefabs['background_layer1']).to( { x: -450 }, 50000, "Quart.easeOut");
    var bg1_tween_back = game.add.tween(this.prefabs['background_layer1']).to( { x: 0 }, 50000, "Quart.easeOut");
    //make bg1 go back and forth
    bg1_tween_forth.chain(bg1_tween_back)
    bg1_tween_back.chain(bg1_tween_forth)

    //bg layer2 animation
    var bg2_tween_forth = game.add.tween(this.prefabs['background_layer2']).to( { x: -300 }, 50000, "Quart.easeOut");
    var bg2_tween_back = game.add.tween(this.prefabs['background_layer2']).to( { x: 0 }, 50000, "Quart.easeOut");
    //make bg1 go back and forth
    bg2_tween_forth.chain(bg2_tween_back)
    bg2_tween_back.chain(bg2_tween_forth)

    //bg layer3 animation
    var bg3_tween_forth = game.add.tween(this.prefabs['background_layer3']).to( { x: -200 }, 50000, "Quart.easeOut");
    var bg3_tween_back = game.add.tween(this.prefabs['background_layer3']).to( { x: 0 }, 50000, "Quart.easeOut");
    //make bg1 go back and forth
    bg3_tween_forth.chain(bg3_tween_back)
    bg3_tween_back.chain(bg3_tween_forth)

    //start animation
    bg1_tween_forth.start()
    bg2_tween_forth.start()
    bg3_tween_forth.start()

    this.TEXT_STYLE = {font: "30px Arial", fill: "#FFFFFF"}
    this.HUD_TEXT_STYLE = {font: "16px Arial", fill: "#FFFFFF"}

    this.username = game.add.inputField(this.game.world.centerX-80, this.game.world.centerY+100, {
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

    this.password = game.add.inputField(this.game.world.centerX-80, this.game.world.centerY + 150, {
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

    var login_button = new TextPrefab(this, "login_button", {x: this.game.world.centerX ,y: this.game.world.centerY + 220},  {group: "hud", text: "LOGIN", style: Object.create(this.TEXT_STYLE)})
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
    var loading_prefab = new Prefab(this, "load", {x:this.game.world.centerX, y:this.game.world.centerY}, {
      group: "hud",
      texture: "load"
    })
    loading_prefab.anchor.setTo(0.5,0.5)
    loading_prefab.animations.add("loading")
    loading_prefab.animations.play("loading", 10, true)

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
        self.load.image("player_avatar", data.user_data_from_git.avatar_url)
        $.get(`http://localhost:8000/users/${data.user.id}/units`, function(data, status){
          console.log(data)
          game.repos = data
          self.state.start('Boot', true, false, "assets/levels/menu.json", "MainMenu")
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
