import ActionState from './ActionState'

export default class extends ActionState {
  constructor (game) {
    super(game)
  }

  enterState () {
    console.log("ActionSelectState")
    this.unit = this.game.properties.ActionStateVar['unit']
    this.game.enableActionCommandHud();
  }

  leaveState () {
    this.game.disableActionCommandHud();
  }

  selectTile (x, y) {
      console.log('fuck')
  }

  setNextState(state) {
    this.next_state = state
  }

  nextState () {
    if(this.nextState){
      this.game.setActionState(this.next_state)
    }
    else {
      console.log("please select menu")
    }
  }
}
