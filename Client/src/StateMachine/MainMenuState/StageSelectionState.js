import MainMenuState from './MainMenuState'

export default class extends MainMenuState{

  enterState(){
    this.game_state.enableStageSelectionMenuHud()
  }

  leaveState(){
    this.game_state.disableStageSelectionMenuHud()
  }
}
