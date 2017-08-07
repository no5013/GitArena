import MainMenuState from './MainMenuState'
import Menu from '../../prefabs/huds/Menu'
import UnitMenuItem from '../../prefabs/huds/UnitMenuItem'
import NextMenuItem from '../../prefabs/huds/MainMenuHuds/NextMenuItem'
import BackMenuItem from '../../prefabs/huds/MainMenuHuds/BackMenuItem'
import TextPrefab from '../../prefabs/TextPrefab'
import Prefab from '../../prefabs/Prefab'


export default class extends MainMenuState{
  constructor(game_state){
    super(game_state)
    this.player_units_list = new Menu(this.game_state, "player_units_list", {x:200,y: this.game_state.game.world.centerY}, {group: "hud", menu_items: null})
    this.enemy_units_list = new Menu(this.game_state, "enemies_units_list", {x:1024-200,y: this.game_state.game.world.centerY}, {group: "hud", menu_items: null})

    this.TEXT_STYLE = {font: "16px Arial", fill: "#FFFFFF"}
    this.MENU_TEXT_STYLE = {font: "32px Arial", fill: "#FFFFFF"}

    this.initMenu({x:this.game_state.game.world.centerX, y:this.game_state.game.world.centerY+300})

    this.vs_text = new TextPrefab(this.game_state, "vs_text", {x: this.game_state.game.world.centerX, y: this.game_state.game.world.centerY}, {
      group: "hud",
      text: "VS",
      style: {font: "50px Arial", fill: "#FFFFFF"},
      anchor: {
        x:0.5,
        y:0.5
      }
    })
    this.prefabs.push(this.vs_text)

    this.title_background = new Prefab(this.game_state, "stage_selection_title_background",{x:200,y:100}, {
      group: "hud",
      texture: "menu_item_image",
      anchor: {
        x:0.5,
        y:0.5
      },
      width: 400,
      height: 75
    })
    this.title = new TextPrefab(this.game_state, "stage_selection_title_text",{x:200,y:100}, {
      group: "hud",
      text: "MATCH SUMMARY",
      style: Object.create(this.game_state.MENU_TEXT_STYLE),
      anchor: {
        x:0.5,
        y:0.5
      }
    })
    this.title_background.tint = 0x000000
    this.prefabs.push(this.title)
    this.prefabs.push(this.title_background)
    this.hidePrefabs()
  }

  initMenu (position) {
    var self = this

    var actions, actions_menu_items, action_index, actions_menu

    // Available Action
    actions = [
      {text: "Start Match", item_constructor: NextMenuItem.prototype.constructor},
      // {text: "Skill", item_constructor: SkillMenuItem.prototype.constructor},
      // {text: "Walk", item_constructor: WalkMenuItem.prototype.constructor},
      // {text: "Endturn", item_constructor: EndTurnMenuItem.prototype.constructor}
    ]
    actions_menu_items = []
    action_index = 0;

    // Create a menu item for each action
    actions_menu_items.push(new NextMenuItem(this.game_state, "match_summary_next_menu_item", {x:this.game_state.game.world.centerX+300, y:this.game_state.game.world.centerY+300}, {group: "hud", text: "Start Match", style: Object.create(this.MENU_TEXT_STYLE), texture: 'menu_item_image', height: 50, anchor: {x:0.5, y:0.5}}))
    actions_menu_items.push(new BackMenuItem(this.game_state, "match_summary_back_menu_item", {x:this.game_state.game.world.centerX-300, y:this.game_state.game.world.centerY+300}, {group: "hud", text: "Back", style: Object.create(this.MENU_TEXT_STYLE), texture: 'menu_item_image', height: 50, anchor: {x:0.5, y:0.5}}))

    this.menu = new Menu(this.game_state, "match_summary_menu", position, {group: "hud", menu_items: actions_menu_items})
    this.disableMenuHud()
  }

  enableMenuHud(){
    this.menu.enable();
    this.menu.show();
  }

  disableMenuHud(){
    this.menu.disable();
    this.menu.hide();
  }

  enableUnitList(){
    this.player_units_list.show()
    this.enemy_units_list.show()
  }

  disableUnitList(){
    this.player_units_list.hide()
    this.enemy_units_list.hide()
  }

  enterState(){
    this.showPrefabs()
    this.vs_text.visible = true
    this.setUnitList(this.player_units_list, this.game_state.properties.ActionStateVar['selected_unit'])
    this.setUnitList(this.enemy_units_list, this.game_state.properties.ActionStateVar['level'].enemy_encounters)
    this.enableMenuHud()
    this.previous_state = this.game_state.MainMenuState.UnitSelectionState
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

    menu.menu_items = actions_menu_items
    menu.hide()
    menu.show()
  }

  leaveState(){
    this.disableMenuHud()
    this.disableUnitList()
    this.hidePrefabs()
  }

  nextState(){
    this.setNextState(this.game_state.MainMenuState.StartMatchState)
    super.nextState()
  }
}
