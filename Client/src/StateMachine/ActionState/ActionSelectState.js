import ActionState from './ActionState'

export default class extends ActionState {
  constructor (game) {
    super(game)
  }

  enterState () {
    this.unit = this.game.properties.ActionStateVar['unit']
    this.game.enableActionCommandHud();
  }

  leaveState () {
    this.game.disableActionCommandHud();
  }

  selectTile (x, y) {
    let tile = this.game.map.getTile(x, y, game.layer)
    let unit = tile.properties['owner']
    if(this.unit === unit){
      console.log("Please select command")
    }
    else {
      console.log("cancel")
      this.cancel()
    }
  }

  cancel(){
    this.game.setActionState(this.game.ActionState.UnitSelectState)
  }

  setNextState(state) {
    this.next_state = state
  }

  nextState () {
    if(this.nextState){
      this.game.setActionState(this.next_state)
    }
    else {
      console.log("please select menu")
    }
  }
}
