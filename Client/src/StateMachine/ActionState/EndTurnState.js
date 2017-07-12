import ActionState from './ActionState'

export default class extends ActionState {
  constructor (game) {
    super(game)
  }

  enterState () {
    this.unit = this.game.current_unit
    this.unit.setDeactive();

    if(this.game.groups.player_units.countLiving()<=0){
      this.game.endBattle()
    }
    else if(this.game.groups.enemy_units.countLiving()<=0){
      this.setNextState(this.game.ActionState.ResultState)
    }
    else{
      this.game.next_turn();
    }
    this.nextState()
  }

  setNextState(state) {
    this.next_state = state
  }

  nextState () {
    if(this.next_state){
      this.game.setActionState(this.next_state)
    }
    else{
      this.game.setActionState(this.game.ActionState.UnitSelectState)
    }
  }
}
