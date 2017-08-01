import ActionState from './ActionState'
import MoveCommand from '../../commands/MoveCommand'

export default class extends ActionState {
  constructor (game) {
    super(game)
  }

  enterState () {
    this.unit = this.game.properties.ActionStateVar['unit']
    this.game.showMovingRange(this.unit)
    this.game.input.addMoveCallback(this.moveDirection,this);
  }

  moveDirection (pointer){
    this.unit.faceTo(pointer.x, pointer.y)
  }

  leaveState () {
    this.game.removeMovingRange(this.unit)
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
      var move_command = new MoveCommand(this.game, this.unit.name+"_move", {x: this.unit.x,y: this.unit.y}, {
        coordinate: {
          x: x,
          y: y
        },
        group: "hud",
        owner: this.unit
      })
      move_command.execute()
    }
    else if(owner){
      console.log(owner.name)
    }
    else if(!rangeTile){
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
