import MainMenuState from './MainMenuState'
import Menu from '../../prefabs/huds/Menu'
import UnitMenuItem from '../../prefabs/huds/UnitMenuItem'
import NextMenuItem from '../../prefabs/huds/MainMenuHuds/NextMenuItem'
import TextPrefab from '../../prefabs/TextPrefab'

export default class extends MainMenuState{
  constructor(game_state){
    super(game_state)
    this.player_units_list = new Menu(this.game_state, "player_units_list", {x:200,y: this.game_state.game.world.centerY}, {group: "hud", menu_items: null})
    this.enemies_units_list = new Menu(this.game_state, "enemies_units_list", {x:1024-200,y: this.game_state.game.world.centerY}, {group: "hud", menu_items: null})
    this.TEXT_STYLE = {font: "16px Arial", fill: "#FFFFFF"}

    this.vs_text = new TextPrefab(this.game_state, "vs_text", {x: this.game_state.game.world.centerX, y: this.game_state.game.world.centerY}, {
      group: "hud",
      text: "VS",
      style: {font: "50px Arial", fill: "#FFFFFF"},
      anchor: {
        x:0.5,
        y:0.5
      }
    })
    this.vs_text.visible = false
  }

  enterState(){
    this.vs_text.visible = true
    this.setUnitList(this.player_units_list, this.game_state.properties.ActionStateVar['selected_unit'])
    this.setUnitList(this.enemies_units_list, this.game_state.properties.ActionStateVar['level'].enemy_encounters)
  }

  setUnitList(menu, units){
    var self = this

    var actions, actions_menu_items, action_index, actions_menu

    // Available Action
    actions = units

    actions_menu_items = []
    action_index = 0;

    // Create a menu item for each action
    actions.forEach(function (action) {
      actions_menu_items.push(new UnitMenuItem(this.game_state, action.name+"_menu_item", {x: menu.x, y: menu.y+action_index * 60}, {
        group: "hud",
        text: action.name,
        style: Object.create(self.TEXT_STYLE),
        texture: "menu_item_image", height: 50, anchor: {x:0.5, y:0.5}, fixedToCamera: true
      }));
      action_index++;
    }, this);

    actions_menu_items.push(new NextMenuItem(this.game_state, "math_summary_next_menu_item", {x: 800, y: 100 + action_index * 60}, {group: "hud", text: "Start Level", style: Object.create(this.TEXT_STYLE)}))

    menu.menu_items = actions_menu_items
    menu.hide()
    menu.show()
  }

  leaveState(){
  }

  nextState(){
    this.setNextState(this.game_state.MainMenuState.StartMatchState)
    super.nextState()
  }
}
