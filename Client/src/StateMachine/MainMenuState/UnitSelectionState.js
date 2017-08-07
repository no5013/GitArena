import MainMenuState from './MainMenuState'
import TextPrefab from '../../prefabs/TextPrefab'
import Prefab from '../../prefabs/Prefab'

export default class extends MainMenuState{
  constructor (game_state) {
    super(game_state)
    this.game_state = game_state;
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
      text: "UNIT SELECTION",
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

  enterState(){
    this.showPrefabs()
    this.game_state.enableUnitSelectionMenuHud()
    this.previous_state = this.game_state.MainMenuState.MainMenuSelectionState
  }

  leaveState(){
    this.hidePrefabs()
    this.game_state.disableUnitSelectionMenuHud()
  }

  nextState(){
    this.game_state.properties.ActionStateVar['selected_unit'] = []
    this.game_state.prefabs['unit_selection_menu'].current_selected.forEach(function(item){
      this.game_state.properties.ActionStateVar['selected_unit'].push(item.item)
    },this)

    this.setNextState(this.game_state.MainMenuState.MatchSummaryState)
    super.nextState()
  }
  // nextState(){
  //   var level = this.game_state.properties.ActionStateVar['level']
  //   var selected_unit = []
  //   this.game_state.prefabs['unit_selection_menu'].current_selected.forEach(function(item){
  //     selected_unit.push(item.item)
  //   })
  //   console.log(selected_unit)
  //
  //   // this.game_state.currentState.setNextState(this.game_state.MainMenuState.UnitSelectionState)
  //   // this.game_state.currentState.nextState();
  //   this.game_state.game.state.start('Boot', true, false, "assets/levels/battle.json", "Game", {
  //     player_units: selected_unit,
  //     level: level
  //   })
  // }
}
