import Phaser from 'phaser'
import MenuItem from './MenuItem'
import NormalAttackCommand from '../../commands/NormalAttackCommand'

export default class extends MenuItem{
  constructor (game_state, name, position, properties) {
    super(game_state, name, position, properties)
  }

  select () {
    let game_state = game.state.states.Game
    let unit = game_state.current_unit

    game_state.properties.ActionStateVar['command'] = new NormalAttackCommand(game_state, unit.name + "_attack", {x: 0,y: 0}, {
      target: null,
      group: "hud",
      owner: unit
    })

    game_state.currentState.setNextState(game_state.ActionState.TargetSelectionState)
    game_state.currentState.nextState();
  }
}
