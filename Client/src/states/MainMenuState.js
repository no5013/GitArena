/* globals __DEV__ */
import TextPrefab from '../prefabs/TextPrefab'

import Menu from '../prefabs/huds/Menu'

import LevelMenuItem from '../prefabs/huds/LevelMenuItem'

export default class extends Phaser.State {

  init () {
    this.groups = {
      hud: this.game.add.group()
    }
  }

  preload () {

  }

  create () {
    var self = this

    this.prefabs = {}

    this.TEXT_STYLE = {font: "30px Arial", fill: "#FFFFFF"}
    this.HUD_TEXT_STYLE = {font: "16px Arial", fill: "#FFFFFF"}
    // this.init_player_actions({x:400, y:100});

    this.initActionMenu({x:400, y:100})
    this.enableActionCommandHud()
  }

  enableActionCommandHud(){
    this.prefabs['levels_selection_menu'].enable();
    this.prefabs['levels_selection_menu'].show();
  }

  disableActionCommandHud(){
    this.prefabs['levels_selection_menu'].disable();
    this.prefabs['levels_selection_menu'].hide();
  }

  initActionMenu(position) {
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
      levels_selection_menu_items.push(new LevelMenuItem(this, action.level_name+"_menu_item", {x: 400, y:100 + action_index * 35}, {group: "hud", level: action.level, text: action.level_name, style: Object.create(self.TEXT_STYLE)}));
      action_index++;
    }, this);
    this.levels_selection_menu = new Menu(this, "levels_selection_menu", position, {group: "hud", menu_items: levels_selection_menu_items})
  }

  render () {

  }
}
