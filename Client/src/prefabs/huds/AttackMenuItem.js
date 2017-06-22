import Phaser from 'phaser'
import MenuItem from './MenuItem'

export default class extends MenuItem{
  constructor (game_state, name, position, properties) {
    super(game_state, name, position, properties)
    this.game_state = game_state
  }

  select () {
    console.log("select attack command")
    this.game_state.currentState.setNextState(this.game_state.ActionState.SkillState)
    this.game_state.currentState.nextState();
  }
}
