import ActionState from './ActionState'

export default class extends ActionState {
  constructor (game) {
    super(game)
  }

  enterState () {
    console.log("EndturnState")
    this.game.next_turn();
    this.nextState();
  }

  nextState () {
    this.game.setActionState(this.game.ActionState.UnitSelectState)
  }
}
