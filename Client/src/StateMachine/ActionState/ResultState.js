import ActionState from './ActionState'

export default class extends ActionState {
  constructor (game) {
    super(game)
  }

  enterState () {
    console.log("RESULT STATE")
    var self = this

    this.game.showResult()

    let timer = this.game.time.create(false);
    timer.loop(1000, function(){
      self.nextState()
    }, this);
    timer.start();
  }

  leaveState () {
    this.game.prefabs['result_text'].visible = false
  }

  nextState () {
    this.game.setActionState(this.game.ActionState.RewardState)
  }
}
