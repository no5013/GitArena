import MainMenuState from './MainMenuState'
var $ = require("jquery");

export default class extends MainMenuState{
  constructor(game_state){
    super(game_state)
  }

  enterState(){
    $.get(`http://localhost:8000/users/${data.id}/units`, function(data, status){
      console.log(data)
      game.repos = data
      self.state.start('MainMenu', true, false)
    })
  }

  leaveState(){
    this.game_state.disableUnitSelectionMenuHud()
  }

  nextState(){
    this.game_state.setMainMenuState(this.game_state.MainMenuState.UnitSelectionState)
  }
}
