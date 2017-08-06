import MainMenuState from './MainMenuState'

export default class extends MainMenuState{
  constructor(game_state){
    super(game_state)
  }

  enterState(){
    this.game_state.enableStageSelectionMenuHud()
  }

  leaveState(){
    this.game_state.disableStageSelectionMenuHud()
  }
}
