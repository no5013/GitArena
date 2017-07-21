import Phaser from 'phaser'
import MenuItem from '../MenuItem'

export default class extends MenuItem{
  constructor (game_state, name, position, properties) {
    super(game_state, name, position, properties)
    this.next_state = properties.next_state
  }

  select () {
    this.game_state.currentState.setNextState(this.next_state)
    this.game_state.currentState.nextState();
  }
}
