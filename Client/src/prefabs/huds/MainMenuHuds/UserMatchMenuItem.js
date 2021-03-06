import Phaser from 'phaser'
import MenuItem from '../MenuItem'

export default class extends MenuItem{
  constructor (game_state, name, position, properties) {
    super(game_state, name, position, properties)
    this.level = properties.level
  }

  select () {
    this.game_state.currentState.setNextState(this.game_state.MainMenuState.LoadOtherUserState)
    this.game_state.currentState.nextState();
  }
}
