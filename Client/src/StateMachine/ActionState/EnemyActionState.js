import ActionState from './ActionState'

export default class extends ActionState {
  constructor (game) {
    super(game)
  }

  enterState () {
    console.log("HEY YO")
    // let commands = this.game.current_unit.act();
    // var current_command = commands[0]
    // current_command.execute()
    this.game.current_unit.act();
  }

  nextState () {
    this.game.setActionState(this.game.ActionState.EndTurnState)
  }
}
