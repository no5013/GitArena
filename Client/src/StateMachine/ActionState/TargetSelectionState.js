import ActionState from './ActionState'
import NormalAttackCommand from '../../commands/NormalAttackCommand'
import Util from '../../util/Util'

export default class extends ActionState {
  constructor (game) {
    super(game)
  }

  enterState () {
    this.unit = this.game.properties.ActionStateVar['unit']

    //check that use skill or not
    if(this.game.properties.ActionStateVar['command'].properties.hasOwnProperty("skill")){
      var skill = this.game.properties.ActionStateVar['command'].properties.skill
      this.game.showAttackRange(this.unit, skill)
    }else{
      this.game.showAttackRange(this.unit)
    }

    this.game.input.addMoveCallback(this.moveDirection,this);
  }

  moveDirection (pointer){
    this.unit.faceTo(pointer.x, pointer.y)
  }

  leaveState () {
    // this.game.input.moveCallbacks = [this.game.input.moveCallbacks[0]]
  }

  selectTile (x, y) {
    let tile = this.game.map.getTile(x, y, game.layer)
    var rangeTile = this.game.rangeMap.getTile(x, y, this.game.rangeLayer)

    let target = tile.properties['owner']
    let command = this.game.properties.ActionStateVar['command']

    if(rangeTile && target && target!=this.unit){
      if(this.game.properties.ActionStateVar['command'].properties.hasOwnProperty("skill")){
        var skill = this.game.properties.ActionStateVar['command'].properties.skill
        this.game.removeAttackRange(this.unit, skill)
      }else{
        this.game.removeAttackRange(this.unit)
      }
      command.properties.target = target
      command.execute()

    }
    else {
      this.cancel()
    }
    this.game.input.deleteMoveCallback(this.moveDirection,this)
  }

  cancel(){
    this.game.setActionState(this.game.ActionState.ActionSelectState)
  }

  nextState () {
    this.game.setActionState(this.game.ActionState.ActionSelectState)
  }
}
