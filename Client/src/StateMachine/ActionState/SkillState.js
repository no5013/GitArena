import ActionState from './ActionState'
import NormalAttackCommand from '../../commands/NormalAttackCommand'

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

    let target = tile.properties['owner']

    if(rangeTile && target && target!=this.unit){
      this.game.removeAttackRange(this.unit)

      var attack_command = new NormalAttackCommand(this.game, this.unit.name+"_move", {x: this.unit.x,y: this.unit.y}, {
        target: target,
        group: "hud",
        owner_name: this.unit.name
      })
      attack_command.execute()

    }
    else{
      console.log("Please select enemy")
    }

  }

  nextState () {
    this.game.setActionState(this.game.ActionState.ActionSelectState)
  }
}
