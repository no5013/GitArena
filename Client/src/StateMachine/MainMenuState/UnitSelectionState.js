import MainMenuState from './MainMenuState'

export default class extends MainMenuState{
  constructor (game_state) {
    super(game_state)
    this.game_state = game_state;
  }

  enterState(){
    console.log("UNIT SELECTION")
    this.game_state.enableUnitSelectionMenuHud()
    this.setNextState(this.game_state.MainMenuState.StartMatchState)
  }

  leaveState(){
    this.game_state.disableUnitSelectionMenuHud()
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
