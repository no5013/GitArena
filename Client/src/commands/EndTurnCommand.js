import ActionCommand from './ActionCommand'

const tile_size_x = 32
const tile_size_y = 32

export default class extends ActionCommand {
  constructor (game_state, name, position, properties) {
    super(game_state, name, position, properties)

    this.action_message_text = "END TURN"
  }

  execute () {
    this.game_state.currentState.setNextState(this.game_state.ActionState.EndTurnState)
    this.showMessage();
  }
}
