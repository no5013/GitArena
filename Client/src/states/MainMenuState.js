/* globals __DEV__ */
import TextPrefab from '../prefabs/TextPrefab'

import Menu from '../prefabs/huds/Menu'

import AttackMenuItem from '../prefabs/huds/AttackMenuItem'
import SkillMenuItem from '../prefabs/huds/SkillMenuItem'
import WalkMenuItem from '../prefabs/huds/WalkMenuItem'
import EndTurnMenuItem from '../prefabs/huds/EndTurnMenuItem'
import SkillSelectionMenuItem from '../prefabs/huds/SkillSelectionMenuItem'

export default class extends Phaser.State {

  init () {

  }

  preload () {

  }

  create () {
    var self = this

    this.prefabs = {}

    this.initUnits()

    this.TEXT_STYLE = {font: "30px Arial", fill: "#FFFFFF"}
    this.HUD_TEXT_STYLE = {font: "16px Arial", fill: "#FFFFFF"}
    // this.init_player_actions({x:400, y:100});

    this.initSkillMenu({x:400, y:100})
    this.initActionMenu({x:400, y:100})
    this.disableActionCommandHud();
    this.disableUnitSkillCommandHud();

    game.world.bringToTop(this.groups.hud);
  }

  enableActionCommandHud(){
    this.setActionMenu(this.current_unit)
    this.prefabs['actions_menu'].enable();
    this.prefabs['actions_menu'].show();
  }

  disableActionCommandHud(){
    this.prefabs['actions_menu'].disable();
    this.prefabs['actions_menu'].hide();
  }

  enableUnitSkillCommandHud(){
    this.prefabs['skills_menu'].enable();
    this.prefabs['skills_menu'].show();
  }

  disableUnitSkillCommandHud(){
    this.prefabs['skills_menu'].disable();
    this.prefabs['skills_menu'].hide();
  }

  initActionMenu(position) {
    var self = this
    var unit = this.current_unit

    var actions, actions_menu_items, action_index, actions_menu

    // Available Action
    actions = this.getAvailableAction(unit)

    actions_menu_items = []
    action_index = 0;

    // Create a menu item for each action
    actions.forEach(function (action) {
      actions_menu_items.push(new action.item_constructor(this, action.text+"_menu_item", {x: 400, y:100 + action_index * 35}, {group: "hud", text: action.text, style: Object.create(self.TEXT_STYLE)}));
      action_index++;
    }, this);
    this.actions_menu = new Menu(this, "level_select_menu", position, {group: "hud", menu_items: actions_menu_items})
  }

  getAvailableAction(unit) {
    let self = this

    var available_actions = []
    unit.actions.forEach(function(action){
      if(!self.used_commands[action.text]){
        available_actions.push(action)
      }
    })
    return available_actions
  }

  setActionMenu () {
    var self = this
    var unit = this.current_unit

    var actions, actions_menu_items, action_index, actions_menu

    // Available Action
    actions = this.getAvailableAction(unit)

    actions_menu_items = []
    action_index = 0;

    // Create a menu item for each action
    actions.forEach(function (action) {
      actions_menu_items.push(new action.item_constructor(this, action.text+"_menu_item", {x: 400, y:100 + action_index * 35}, {group: "hud", text: action.text, style: Object.create(self.TEXT_STYLE)}));
      action_index++;
    }, this);
    this.actions_menu.menu_items = actions_menu_items
    this.disableActionCommandHud()
  }

  initSkillMenu (position) {
    this.skills_menu = new Menu(this, "skills_menu", position, {group: "hud", menu_items: []})
  }

  resetTurn(){
    this.used_commands = {}
  }

  setSkillMenu(){
    var self = this
    var unit = this.current_unit

    var actions, actions_menu_items, action_index, actions_menu

    // Available Action
    actions = unit.skills

    actions_menu_items = []
    action_index = 0;

    // Create a menu item for each action
    actions.forEach(function (action) {
      actions_menu_items.push(new SkillSelectionMenuItem(this, action.name+"_menu_item", {x: 400, y: 100 + action_index * 35}, {
        skill: action,
        group: "hud",
        text: action.name,
        style: Object.create(self.TEXT_STYLE)
      }));
      action_index++;
      console.log(action.name);
    }, this);
    this.skills_menu.menu_items = actions_menu_items
    this.disableUnitSkillCommandHud()
  }

  render () {

  }
}
