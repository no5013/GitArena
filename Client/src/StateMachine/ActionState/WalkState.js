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

  leaveState () {
    this.unit = this.game.properties.ActionStateVar['walked'] = true
  }

  selectTile (x, y) {

    var x2 = this.game.layer.getTileX(this.unit.x);
    var y2 = this.game.layer.getTileY(this.unit.y);
    var currentTile = this.game.map.getTile(x2, y2, this.game.layer)

    var nextTile = this.game.map.getTile(x, y, this.game.layer)
    var rangeTile = this.game.rangeMap.getTile(x, y, this.game.rangeLayer)
    var owner = nextTile.properties['owner']

    if(!owner && rangeTile){
      this.game.removeMovingRange(this.unit)
      // this.game.moveCharacter(this.unit, currentTile, nextTile)
      this.game.moveUnit(this.unit, x, y, this.game.finishAction)
    }
    else if(owner){
      console.log(owner.name)
    }
    else if(!rangeTile){
      console.log('exceed range')
    }
  }

  nextState () {
    this.game.setActionState(this.game.ActionState.ActionSelectState)
  }
}
