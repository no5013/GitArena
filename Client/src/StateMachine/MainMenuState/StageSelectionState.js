import MainMenuState from './MainMenuState'

export default class extends MainMenuState{
  constructor(game_state){
    super(game_state)
  }

  enterState(){
    this.game_state.enableStageSelectionMenuHud()
    this.previous_state = this.game_state.MainMenuState.MainMenuSelectionState
  }

  leaveState(){
    this.game_state.disableStageSelectionMenuHud()
  }
}
