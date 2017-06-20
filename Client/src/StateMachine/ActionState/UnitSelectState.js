import ActionState from './ActionState'

export default class extends ActionState {
  constructor (game) {
    super(game)
  }

  enterState () {
    console.log("select state")
  }

  selectTile (x, y) {
    let tile = this.game.map.getTile(x, y, game.layer)
    let unit = tile.properties['owner']
    if(unit&&unit.properties['active']){
      console.log("UNIT SELECTED")
      console.log(unit.name)
      this.game.properties.ActionStateVar['unit'] = unit
      this.game.properties.ActionStateVar['currentTile'] = tile
      this.nextState();
    }
    else if(unit&&!unit.properties['active']){
      console.log("not active")
    }
    else {
      console.log("PLEASE SELECT UNIT")
    }
  }
  nextState () {
    this.game.setActionState(this.game.ActionState.ActionSelectState)
  }
}
