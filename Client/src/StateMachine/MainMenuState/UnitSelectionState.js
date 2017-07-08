import MainMenuState from './MainMenuState'

export default class extends MainMenuState{
  enterState(){
    console.log("UNIT SELECTION")
    this.game_state.enableUnitSelectionMenuHud()
  }

  leaveState(){
    this.game_state.disableUnitSelectionMenuHud()
  }
}
