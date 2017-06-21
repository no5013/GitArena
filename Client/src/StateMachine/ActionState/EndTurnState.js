import ActionState from './ActionState'

export default class extends ActionState {
  constructor (game) {
    super(game)
  }

  enterState () {
    console.log("EndturnState")
    this.unit = this.game.properties.ActionStateVar['unit']
    this.unit.setDeactive();
    this.game.next_turn();
    this.nextState();
  }

  nextState () {
    this.game.setActionState(this.game.ActionState.UnitSelectState)
  }
}
