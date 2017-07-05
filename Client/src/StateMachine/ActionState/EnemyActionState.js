import ActionState from './ActionState'

export default class extends ActionState {
  constructor (game) {
    super(game)
  }

  enterState () {
    this.clearState()

    let command_list = this.game.current_unit.getCommand();

    let runner = 0

    //FUCKING HARD CODE
    let command_timer = this.game.time.create(false);
    command_timer.loop(1000, function(){
      command_list[runner++].execute()
      if(runner>=command_list.length){
        command_timer.stop();
      }
    }, this);
    command_timer.start();
  }

  clearState () {
    this.next_state = null
  }

  setNextState(state) {
    this.next_state = state
  }

  nextState () {
    if(this.next_state){
      this.game.setActionState(this.next_state)
    }
  }
}
