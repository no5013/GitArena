import ActionState from './ActionState'
import NormalAttackCommand from '../../commands/NormalAttackCommand'
import Util from '../../util/Util'
import {SkillType} from '../../Skills/SkillType'

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
    this.game.removeRange();
    this.unit.faceTo(pointer.x, pointer.y)
    this.game.showAttackRange(this.unit, this.game.properties.ActionStateVar['command'].properties.skill);
  }

  leaveState () {
    // this.game.input.moveCallbacks = [this.game.input.moveCallbacks[0]]
  }

  selectTile (x, y) {
    var skill = this.game.properties.ActionStateVar['command'].properties.skill

    console.log(skill)
    if(skill!=null && skill.type == SkillType.MAP){
      console.log("WTF")
      var targets = []
      var attack_range_coordinate = skill.getSkillRangeCoordinate(this.unit.direction)
      attack_range_coordinate.forEach(function(attack){
        let tile = this.game.map.getTile((this.unit.x/32)+attack.x, (this.unit.y/32)+attack.y, game.layer)
        var rangeTile = this.game.rangeMap.getTile((this.unit.x/32)+attack.x, (this.unit.y/32)+attack.y, this.game.rangeLayer)
        var target = tile.properties['owner']
        if(target!=null){
          targets.push(target)
        }
      },this)
      console.log(targets)
      this.cancel()
    }
    else{
      console.log("WTF2")
      let tile = this.game.map.getTile(x, y, game.layer)
      var rangeTile = this.game.rangeMap.getTile(x, y, this.game.rangeLayer)
      let target = tile.properties['owner']
      let command = this.game.properties.ActionStateVar['command']

      if(rangeTile && target && target!=this.unit){
        this.game.removeRange()
        command.properties.target = target
        command.execute()
      }
      else {
        this.cancel()
      }
    }
    this.game.input.deleteMoveCallback(this.moveDirection,this)
  }

  cancel(){
    this.game.removeRange()
    this.game.setActionState(this.game.ActionState.ActionSelectState)
  }

  nextState () {
    this.game.setActionState(this.game.ActionState.ActionSelectState)
  }
}
