import ActionState from './ActionState'

export default class extends ActionState {
  constructor (game) {
    super(game)
  }

  enterState () {
    this.unit = this.game.properties.ActionStateVar['unit']
    this.game.enableUnitSkillCommandHud();
  }

  leaveState () {
    this.game.disableUnitSkillCommandHud();
  }

  setNextState(state) {
    this.next_state = state
  }

  selectTile (x, y) {
    let tile = this.game.map.getTile(x, y, game.layer)
    let unit = tile.properties['owner']
    if(this.unit === unit){
      console.log("Please select skill")
    }
    else {
      console.log("cancel")
      this.cancel()
    }
  }

  cancel(){
    this.game.setActionState(this.game.ActionState.ActionSelectState)
  }

  nextState () {
    if(this.nextState){
      this.game.setActionState(this.next_state)
    }
    else{
      this.game.setActionState(this.game.ActionState.TargetSelectionState)
    }
  }
}
