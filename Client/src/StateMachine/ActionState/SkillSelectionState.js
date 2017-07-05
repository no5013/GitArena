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

  nextState () {
    if(this.nextState){
      this.game.setActionState(this.next_state)
    }
    else{
      this.game.setActionState(this.game.ActionState.TargetSelectionState)
    }
  }
}
