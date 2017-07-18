import ActionState from './ActionState'
import NormalAttackCommand from '../../commands/NormalAttackCommand'

export default class extends ActionState {
  constructor (game) {
    super(game)
  }

  enterState () {
    this.unit = this.game.properties.ActionStateVar['unit']
    this.game.showAttackRange(this.unit)
  }

  leaveState () {
    this.game.removeMovingRange(this.unit)
  }

  selectTile (x, y) {
    let tile = this.game.map.getTile(x, y, game.layer)
    var rangeTile = this.game.rangeMap.getTile(x, y, this.game.rangeLayer)

    let target = tile.properties['owner']
    let command = this.game.properties.ActionStateVar['command']

    if(rangeTile && target && target!=this.unit){
      this.game.removeAttackRange(this.unit)
      command.properties.target = target
      command.execute()

    }
    else if(rangeTile){
      console.log("Please select enemy")
    }
    else {
      this.cancel()
    }

  }

  cancel(){
    this.game.setActionState(this.game.ActionState.ActionSelectState)
  }

  nextState () {
    this.game.setActionState(this.game.ActionState.ActionSelectState)
  }
}
