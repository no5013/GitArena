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

  selectTile (x, y) {
    let tile = this.game.map.getTile(x, y, game.layer)
    let unit = tile.properties['owner']
    console.log(tile)
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
