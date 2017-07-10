import ActionState from './ActionState'
import PlayerUnit from '../../prefabs/units/PlayerUnit'

export default class extends ActionState {
  constructor (game) {
    super(game)
  }

  enterState () {
    console.log(this.game.current_unit.name)
    if(this.game.current_unit instanceof PlayerUnit){
      console.log("HEY THIS IS PLAYER")
      this.setNextState(this.game.ActionState.ActionSelectState)
    }
    else {
      console.log("HEY THIS IS ENEMY")
      this.setNextState(this.game.ActionState.EnemyActionState)
      this.nextState()
    }
  }

  selectTile (x, y) {
    let tile = this.game.map.getTile(x, y, game.layer)
    console.log(tile)
    let unit = tile.properties['owner']
    if(unit&&unit.status['active']){
      this.game.properties.ActionStateVar['unit'] = unit
      this.game.properties.ActionStateVar['currentTile'] = tile
      this.nextState();
    }
    else if(unit&&!unit.status['active']){
      console.log("not active")
    }
    else {
      console.log("PLEASE SELECT UNIT")
    }
  }

  setNextState(next_state){
    this.next_state = next_state
  }

  nextState () {
    console.log("UNIT SELECT NEXT STATE")
    if(!this.next_state){
      this.game.setActionState(this.game.ActionState.ActionSelectState)
    }else
    {
      this.game.setActionState(this.next_state)
    }
  }
}
