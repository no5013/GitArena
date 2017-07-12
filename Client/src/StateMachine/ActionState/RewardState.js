import ActionState from './ActionState'

export default class extends ActionState {
  constructor (game) {
    super(game)
  }

  enterState () {
    console.log("REWARD STATE")
    var self = this

    this.game.showReward()

    let timer = this.game.time.create(false);
    timer.loop(1000, function(){
      self.game.endBattle()
      timer.stop();
    }, this);
    timer.start();
  }
}
