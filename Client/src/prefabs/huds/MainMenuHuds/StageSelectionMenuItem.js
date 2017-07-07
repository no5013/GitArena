import Phaser from 'phaser'
import MenuItem from '../MenuItem'

export default class extends MenuItem{
  constructor (game_state, name, position, properties) {
    super(game_state, name, position, properties)
  }

  select () {
    // let game_state = game.state.states.Game
    // let unit = game_state.current_unit
    console.log("FUCK U")
    this.game_state.currentState.setNextState(this.game_state.MainMenuState.StageSelectionState)
    this.game_state.currentState.nextState();
  }
}
