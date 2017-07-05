import Phaser from 'phaser'
import MenuItem from './MenuItem'
import EndTurnCommand from '../../commands/EndTurnCommand'

export default class extends MenuItem{
  constructor (game_state, name, position, properties) {
    super(game_state, name, position, properties)
  }

  select () {
    this.game_state = game.state.states.Game
    // game_state.currentState.setNextState(game_state.ActionState.EndTurnState)
    // game_state.currentState.nextState();
    this.unit = this.game_state.current_unit
    var endTurn_command = new EndTurnCommand(this.game_state, this.unit.name+"_endturn", {x: 0,y: 0}, {
      group: "hud",
      owner_name: this.unit.name
    })
    endTurn_command.execute()
  }
}
