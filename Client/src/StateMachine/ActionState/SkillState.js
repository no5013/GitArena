import ActionState from './ActionState'

export default class extends ActionState {
  constructor (game) {
    super(game)
  }

  enterState () {
    console.log("skillState")
    this.unit = this.game.properties.ActionStateVar['unit']
    this.game.showAttackRange(this.unit)
  }

  selectTile (x, y) {
    let tile = this.game.map.getTile(x, y, game.layer)
    var rangeTile = this.game.rangeMap.getTile(x, y, this.game.rangeLayer)

    let anotherUnit = tile.properties['owner']

    if(rangeTile && anotherUnit && anotherUnit!=this.unit){
      this.game.removeAttackRange(this.unit)
      this.unit.attack(anotherUnit)
      // this.nextState()
    }
    else{
      console.log("Please select enemy")
    }

  }

  nextState () {
    this.game.setActionState(this.game.ActionState.EndTurnState)
  }
}
