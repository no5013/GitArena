import ActionState from './ActionState'

export default class extends ActionState {
  constructor (game) {
    super(game)
  }

  enterState () {
    console.log("ENEMY STATE")
    this.clearState()

    let command_list = this.game.current_unit.getCommand();

    let runner = 0

    //FUCKING HARD CODE
    let command_timer = this.game.time.create(false);
    command_timer.loop(1000, function(){
      console.log("EXECUTE" + runner)
      command_list[runner++].execute()
      if(runner>=command_list.length){
        command_timer.stop();
      }
    }, this);
    command_timer.start();

    // game.time.events.start()
    // var command_loop = game.time.events.loop(Phaser.Timer.SECOND, function(){
    //   console.log("EXECUTE" + runner)
    //   command_list[runner++].execute()
    //   if(runner>=command_list.length){
    //     game.time.events.stop()
    //   }
    // }, this);
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
