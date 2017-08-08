/* globals __DEV__ */
import TextPrefab from '../prefabs/TextPrefab'

import Menu from '../prefabs/huds/Menu'
import MultiSelectionMenu from '../prefabs/huds/MultiSelectionMenu'

import MenuItem from '../prefabs/huds/MenuItem'
import LevelMenuItem from '../prefabs/huds/MainMenuHuds/LevelMenuItem'
import StageSelectionMenuItem from '../prefabs/huds/MainMenuHuds/StageSelectionMenuItem'
import MultiSelectionMenuItem from '../prefabs/huds/MultiSelectionMenuItem'
import UnitMultiSelectionMenuItem from '../prefabs/huds/MainMenuHuds/UnitMultiSelectionMenuItem'

import NextMenuItem from '../prefabs/huds/MainMenuHuds/NextMenuItem'
import BackMenuItem from '../prefabs/huds/MainMenuHuds/BackMenuItem'
import UserMatchMenuItem from '../prefabs/huds/MainMenuHuds/UserMatchMenuItem'

import MainMenuSelectionState from '../StateMachine/MainMenuState/MainMenuSelectionState'
import StageSelectionState from '../StateMachine/MainMenuState/StageSelectionState'
import UnitSelectionState from '../StateMachine/MainMenuState/UnitSelectionState'
import LoadOtherUserState from '../StateMachine/MainMenuState/LoadOtherUserState'
import StartMatchState from '../StateMachine/MainMenuState/StartMatchState'
import MatchSummaryState from '../StateMachine/MainMenuState/MatchSummaryState'

import UnitFactory from '../factories/UnitFactory'

import Prefab from '../prefabs/Prefab'

export default class extends Phaser.State {

  init (level_data, extra_parameters) {
    this.levels = []
    var asset_key, asset;
    for (asset_key in level_data.levels) { // load assets according to asset key
      if (level_data.levels.hasOwnProperty(asset_key)) {
        asset = level_data.levels[asset_key];
        this.levels.push(asset)
      }
    }

    this.properties = {
      ActionStateVar: {}
    }

    this.menu_data = level_data
  }

  preload () {
    this.load.image("player_avatar", game.user.user_data_from_git.avatar_url)
  }

  create () {
    //Define Text style
    this.TEXT_STYLE = {font: "30px Arial", fill: "#FFFFFF"}
    this.HUD_TEXT_STYLE = {font: "16px Arial", fill: "#FFFFFF"}
    this.MENU_TEXT_STYLE = {font: "32px Arial", fill: "#FFFFFF"}

    // create groups
    this.groups = {};
    this.menu_data.groups.forEach(function (group_name) {
      this.groups[group_name] = this.game.add.group();
    }, this);

    // create prefabs
    this.prefabs = {};
    for (let prefab_name in this.menu_data.prefabs) {
      if (this.menu_data.prefabs.hasOwnProperty(prefab_name)) {
        console.log(prefab_name)
        // create prefab
        this.createPrefab(prefab_name, this.menu_data.prefabs[prefab_name]);
      }
    }

    let self = this;
    this.MainMenuState = {
      MainMenuSelectionState: new MainMenuSelectionState(self),
      StageSelectionState: new StageSelectionState(self),
      UnitSelectionState: new UnitSelectionState(self),
      LoadOtherUserState: new LoadOtherUserState(self),
      StartMatchState: new StartMatchState(self),
      MatchSummaryState: new MatchSummaryState(self)
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

    this.createPlayerUnits()
    this.initMainMenu({x:200, y:200})
    this.initStageSelectionMenu({x:200, y:200})
    this.initUnitSelectionMenuHud({x:this.game.world.centerX, y:200})
    this.initPlayerData({x:700,y:20})
    this.setMainMenuState(this.MainMenuState.MainMenuSelectionState)


  }

  createPrefab(prefab_name, prefab_data){
    var prefab;
    // create object according to its type
    //if (this.prefab_classes.hasOwnProperty(prefab_data.type)) {
    prefab = new Prefab(this, prefab_name, prefab_data.position, Object.create(prefab_data.properties));
    //}
  }

  initPlayerData(position){
    var player_avatar = new Prefab(this, "player_avatar", position, {
      group: "hud",
      texture: 'player_avatar',
      scale: {
        x:0.2,
        y:0.2
      }
    })

    var player_name = new TextPrefab(this, "player_name", {x: position.x+100, y: position.y}, {
      group: "hud",
      text: "NAME: " + game.user.user_data_from_git.username,
      style: Object.create(this.HUD_TEXT_STYLE)
    })

    var player_units = new TextPrefab(this, "player_units", {x: position.x+100, y: position.y +33}, {
      group: "hud",
      text: "UNITS: " + game.user.user_data_from_git.public_repos,
      style: Object.create(this.HUD_TEXT_STYLE)
    })

    var player_follower = new TextPrefab(this, "player_follower", {x: position.x+100, y: position.y +66}, {
      group: "hud",
      text: "FOLLOWER: " + game.user.user_data_from_git.followers,
      style: Object.create(this.HUD_TEXT_STYLE)
    })
  }

  createPlayerUnits () {
    this.player_units = []
    this.game.repos.slice(0,5).forEach(function(repo){
      this.player_units.push(UnitFactory.generateUnitFromRepoData(repo))
    },this)
  }

  initUnitSelectionMenuHud(position){
    var self = this

    var actions, actions_menu_items, action_index, actions_menu

    //Limit the unit to 5
    actions = this.player_units

    actions_menu_items = []
    action_index = 0;

    //Init menu
    this.unit_selection_menu = new MultiSelectionMenu(this, "unit_selection_menu", position, {group: "hud", menu_items: null, maximum_size: 4})

    // Create a menu item for each action
    actions.forEach(function (action) {
      actions_menu_items.push(new UnitMultiSelectionMenuItem(this, action.name+"_menu_item", {x: position.x, y: position.y + action_index * 100}, {group: "hud", style: Object.create(self.HUD_TEXT_STYLE), owner: this.unit_selection_menu, item: action, texture: "menu_item_image", height: 100 ,width: 500 , anchor: {x:0.5, y:0.5}}));
      action_index++;
    }, this);

    actions_menu_items.push(new NextMenuItem(this, "level_selection_next_menu_item", {x:this.game.world.centerX+312, y:this.game.world.centerY+300}, {group: "hud", text: "Next", style: Object.create(this.MENU_TEXT_STYLE), texture: 'menu_item_image', height: 50, anchor: {x:0.5, y:0.5}}))
    actions_menu_items.push(new BackMenuItem(this, "level_selection_back_menu_item", {x:this.game.world.centerX-312, y:this.game.world.centerY+300}, {group: "hud", text: "Back", style: Object.create(this.MENU_TEXT_STYLE), texture: 'menu_item_image', height: 50, anchor: {x:0.5, y:0.5}}))
    this.unit_selection_menu.menu_items = actions_menu_items
    this.disableUnitSelectionMenuHud()
  }

  enableMainMenuHud(){
    this.prefabs['main_menu'].enable();
    this.prefabs['main_menu'].show();
  }

  disableMainMenuHud(){
    this.prefabs['main_menu'].disable();
    this.prefabs['main_menu'].hide();
  }

  enableUnitSelectionMenuHud(){
    this.prefabs['unit_selection_menu'].enable();
    this.prefabs['unit_selection_menu'].show();
  }

  disableUnitSelectionMenuHud(){
    this.prefabs['unit_selection_menu'].disable();
    this.prefabs['unit_selection_menu'].hide();
  }

  enableStageSelectionMenuHud(){
    this.prefabs['levels_selection_menu'].enable();
    this.prefabs['levels_selection_menu'].show();
  }

  disableStageSelectionMenuHud(){
    this.prefabs['levels_selection_menu'].disable();
    this.prefabs['levels_selection_menu'].hide();
  }

  initMainMenu (position) {
    var self = this

    var actions, actions_menu_items, action_index, actions_menu

    // Available Action
    actions = [
      {text: "User Match", item_constructor: UserMatchMenuItem.prototype.constructor},
      {text: "Stage Select", item_constructor: StageSelectionMenuItem.prototype.constructor},
      // {text: "Skill", item_constructor: SkillMenuItem.prototype.constructor},
      // {text: "Walk", item_constructor: WalkMenuItem.prototype.constructor},
      // {text: "Endturn", item_constructor: EndTurnMenuItem.prototype.constructor}
    ]
    actions_menu_items = []
    action_index = 0;

    // Create a menu item for each action
    actions.forEach(function (action) {
      actions_menu_items.push(new action.item_constructor(this, action.text+"_menu_item", {x: position.x, y: position.y + action_index * 100}, {group: "hud", text: action.text, style: Object.create(self.TEXT_STYLE), texture: "menu_item_image", height: 50, anchor: {x:0.5, y:0.5}}));
      action_index++;
    }, this);
    this.main_menu = new Menu(this, "main_menu", position, {group: "hud", menu_items: actions_menu_items})
    this.disableMainMenuHud()
  }

  initStageSelectionMenu(position) {
    var self = this

    var actions, levels_selection_menu_items, action_index, levels_selection_menu

    // Available Action
    actions = this.levels

    levels_selection_menu_items = []
    action_index = 0;

    // Create a menu item for each action
    actions.forEach(function (action) {
      levels_selection_menu_items.push(new LevelMenuItem(this, action.level_name+"_menu_item", {x: position.x, y: position.y + action_index * 100}, {group: "hud", level: action, text: action.level_name, style: Object.create(self.TEXT_STYLE), texture: "menu_item_image", height: 50, anchor: {x:0.5, y:0.5}}));
      action_index++;
    }, this);
    levels_selection_menu_items.push(new BackMenuItem(this, "level_selection_back_menu_item", {x:this.game.world.centerX, y:this.game.world.centerY+300}, {group: "hud", text: "Back", style: Object.create(this.MENU_TEXT_STYLE), texture: 'menu_item_image', height: 50, anchor: {x:0.5, y:0.5}}))
    this.levels_selection_menu = new Menu(this, "levels_selection_menu", position, {group: "hud", menu_items: levels_selection_menu_items})
    this.disableStageSelectionMenuHud()
  }

  setMainMenuState(state) {
    var old_state
    if(this.currentState){
      this.currentState.leaveState();
    }
    this.currentState = state;
    this.currentState.enterState();
  }

  render () {

  }
}
