import ActionState from './ActionState'

export default class extends ActionState {
  constructor (game) {
    super(game)
  }

  enterState () {
    console.log("HEY YO")
    this.game.current_unit.act();
  }

  nextState () {
    this.game.setActionState(this.game.ActionState.EndTurnState)
  }
}
