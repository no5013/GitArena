import ActionState from './ActionState'

export default class extends ActionState {
  constructor (game) {
    super(game)
  }

  enterState () {
    console.log("walkingState")
    this.unit = this.game.properties.ActionStateVar['unit']
    this.game.showMovingRange(this.unit)
  }

  selectTile (x, y) {
    var currentTile = this.game.properties.ActionStateVar['currentTile']
    var nextTile = this.game.map.getTile(x, y, this.game.layer)
    var rangeTile = this.game.rangeMap.getTile(x, y, this.game.rangeLayer)
    var owner = nextTile.properties['owner']

    if(!owner && rangeTile){
      this.game.removeMovingRange(this.unit)
      this.game.moveCharacter(this.unit, currentTile, nextTile)
      this.game.clearMoving()
    }else{
      console.log('exceed range')
    }
  }

  nextState () {
    this.game.setActionState(this.game.ActionState.UnitSelectState)
  }
}
