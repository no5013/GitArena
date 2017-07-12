export default class {
  constructor (game_state) {
    this.game_state = game_state;
    this.next_state = this
  }

  enterState () {
    console.log("enter state")
  }

  leaveState () {
    console.log("leave state")
  }

  setNextState(state) {
    this.next_state = state
  }

  nextState () {
    this.game_state.setMainMenuState(this.next_state)
  }
}