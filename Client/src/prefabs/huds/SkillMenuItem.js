import Phaser from 'phaser'
import MenuItem from './MenuItem'
import NormalAttackCommand from '../../commands/NormalAttackCommand'

export default class extends MenuItem{
  constructor (game_state, name, position, properties) {
    super(game_state, name, position, properties)
  }

  select () {
    console.log("HOOY EAYEASHG")
    let game_state = game.state.states.Game

    game_state.currentState.setNextState(game_state.ActionState.SkillSelectionState)
    game_state.currentState.nextState();
  }
}
