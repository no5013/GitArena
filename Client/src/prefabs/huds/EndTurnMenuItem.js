import Phaser from 'phaser'
import MenuItem from './MenuItem'

export default class extends MenuItem{
  constructor (game_state, name, position, properties) {
    super(game_state, name, position, properties)
    this.game_state = game_state
  }

  select () {
    console.log("select end-turn command")
    this.game_state.currentState.setNextState(this.game_state.ActionState.EndTurnState)
    this.game_state.currentState.nextState();
  }
}
