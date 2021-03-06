import MainMenuState from './MainMenuState'
import TextPrefab from '../../prefabs/TextPrefab'

export default class extends MainMenuState{
  constructor(game_state){
    super(game_state)
  }

  enterState(){
    var level = this.game_state.properties.ActionStateVar['level']
    // var selected_unit = []
    // this.game_state.prefabs['unit_selection_menu'].current_selected.forEach(function(item){
    //   selected_unit.push(item.item)
    // })
    // console.log(selected_unit)

    // this.game_state.currentState.setNextState(this.game_state.MainMenuState.UnitSelectionState)
    // this.game_state.currentState.nextState();
    this.game_state.game.state.start('Boot', true, false, "assets/levels/battle.json", "Game", {
      player_units: this.game_state.properties.ActionStateVar['selected_unit'],
      level: level
    })
  }

  leaveState(){
  }
}
