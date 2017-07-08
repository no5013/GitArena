import MainMenuState from './MainMenuState'

export default class extends MainMenuState{
  constructor(game_state){
    super(game_state)
  }

  enterState(){
    this.game_state.enableMainMenuHud()
  }

  leaveState(){
    this.game_state.disableMainMenuHud()
  }
}
