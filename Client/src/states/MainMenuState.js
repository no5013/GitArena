/* globals __DEV__ */
import TextPrefab from '../prefabs/TextPrefab'

import Menu from '../prefabs/huds/Menu'
import MultiSelectionMenu from '../prefabs/huds/MultiSelectionMenu'

import MenuItem from '../prefabs/huds/MenuItem'
import LevelMenuItem from '../prefabs/huds/MainMenuHuds/LevelMenuItem'
import StageSelectionMenuItem from '../prefabs/huds/MainMenuHuds/StageSelectionMenuItem'
import MultiSelectionMenuItem from '../prefabs/huds/MultiSelectionMenuItem'
import StartLevelMenuItem from '../prefabs/huds/MainMenuHuds/StartLevelMenuItem'

import MainMenuSelectionState from '../StateMachine/MainMenuState/MainMenuSelectionState'
import StageSelectionState from '../StateMachine/MainMenuState/StageSelectionState'
import UnitSelectionState from '../StateMachine/MainMenuState/UnitSelectionState'

export default class extends Phaser.State {

  init () {

    let self = this;
    this.MainMenuState = {
      MainMenuSelectionState: new MainMenuSelectionState(self),
      StageSelectionState: new StageSelectionState(self),
      UnitSelectionState: new UnitSelectionState(self)
    }

    this.properties = {
      ActionStateVar: {}
    }

    this.prefabs = {}
    this.groups = {
      hud: this.game.add.group()
    }
  }

  preload () {

  }

  create () {
    var self = this


    this.TEXT_STYLE = {font: "30px Arial", fill: "#FFFFFF"}
    this.HUD_TEXT_STYLE = {font: "16px Arial", fill: "#FFFFFF"}

    this.initMainMenu({x:400, y:100})
    this.initStageSelectionMenu({x:400, y:100})
    this.initUnitSelectionMenuHud({x:400, y:100})

    this.setMainMenuState(this.MainMenuState.MainMenuSelectionState)
  }

  initUnitSelectionMenuHud(position){
    var self = this

    var actions_menu_items = []

    // this.test_menu = null
    this.unit_selection_menu = new MultiSelectionMenu(this, "unit_selection_menu", position, {group: "hud", menu_items: null, maximum_size: 2})
    actions_menu_items.push(new MultiSelectionMenuItem(this, "test_menu_item1", {x: position.x, y: position.y}, {group: "hud", text: "test1", style: Object.create(this.TEXT_STYLE), owner: this.unit_selection_menu}))
    actions_menu_items.push(new MultiSelectionMenuItem(this, "test_menu_item2", {x: position.x, y: position.y+35}, {group: "hud", text: "test2", style: Object.create(this.TEXT_STYLE), owner: this.unit_selection_menu}))
    actions_menu_items.push(new MultiSelectionMenuItem(this, "test_menu_item3", {x: position.x, y: position.y+70}, {group: "hud", text: "test3", style: Object.create(this.TEXT_STYLE), owner: this.unit_selection_menu}))
    actions_menu_items.push(new MultiSelectionMenuItem(this, "test_menu_item4", {x: position.x, y: position.y+105}, {group: "hud", text: "test4", style: Object.create(this.TEXT_STYLE), owner: this.unit_selection_menu}))
    actions_menu_items.push(new StartLevelMenuItem(this, "test_menu_item5", {x: position.x, y: position.y+140}, {group: "hud", text: "start level", style: Object.create(this.TEXT_STYLE)}))
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
      {text: "Stage Select", item_constructor: StageSelectionMenuItem.prototype.constructor},
      // {text: "Skill", item_constructor: SkillMenuItem.prototype.constructor},
      // {text: "Walk", item_constructor: WalkMenuItem.prototype.constructor},
      // {text: "Endturn", item_constructor: EndTurnMenuItem.prototype.constructor}
    ]
    actions_menu_items = []
    action_index = 0;

    // Create a menu item for each action
    actions.forEach(function (action) {
      actions_menu_items.push(new action.item_constructor(this, action.text+"_menu_item", {x: position.x, y: position.y + action_index * 35}, {group: "hud", text: action.text, style: Object.create(self.TEXT_STYLE)}));
      action_index++;
    }, this);
    this.main_menu = new Menu(this, "main_menu", position, {group: "hud", menu_items: actions_menu_items})
    this.disableMainMenuHud()
  }

  initStageSelectionMenu(position) {
    var self = this

    var actions, levels_selection_menu_items, action_index, levels_selection_menu

    // Available Action
    actions = [
      {
        "level_name": "level1",
        "level": 1
      },
      {
        "level_name": "level2",
        "level": 2
      },
      {
        "level_name": "level3",
        "level": 1
      },
      {
        "level_name": "level4",
        "level": 1
      }
    ]

    levels_selection_menu_items = []
    action_index = 0;

    // Create a menu item for each action
    actions.forEach(function (action) {
      levels_selection_menu_items.push(new LevelMenuItem(this, action.level_name+"_menu_item", {x: position.x, y: position.y + action_index * 35}, {group: "hud", level: action.level, text: action.level_name, style: Object.create(self.TEXT_STYLE)}));
      action_index++;
    }, this);
    this.levels_selection_menu = new Menu(this, "levels_selection_menu", position, {group: "hud", menu_items: levels_selection_menu_items})
    this.disableStageSelectionMenuHud()
  }

  setMainMenuState(state) {
    if(this.currentState){
      this.currentState.leaveState();
    }
    this.currentState = state;
    this.currentState.enterState();
  }

  render () {

  }
}
