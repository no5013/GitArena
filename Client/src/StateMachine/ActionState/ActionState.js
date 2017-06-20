export default class {
  constructor (game) {
    this.game = game;
  }

  enterState () {
    console.log("enter state")
  }

  leaveState () {
    console.log("leave state")
  }

  selectTile () {
    console.log("not implement")
  }

  cancel () {
    console.log("not implement")
  }

  undo () {
    console.log("not implement")
  }

  setNextState(state) {
    console.log("not implement")
  }

  nextState () {
    console.log("not implement")
  }
}
