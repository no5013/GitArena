import Phaser from 'phaser'
import Prefab from '../Prefab'
import TextPrefab from '../TextPrefab'

export default class extends Prefab {
  constructor (game_state, name, position, properties) {
    super(game_state, name, position ,properties)

    this.anchor.setTo(0.5)
    this.fixedToCamera = true

    // create message text
    this.message_text = new TextPrefab(this.game_state, this.name + "_message", position, {
      group: "hud",
      text: properties.message,
      style: Object.create(this.game_state.HUD_TEXT_STYLE)
    });
    this.message_text.anchor.setTo(0.5)

    this.finish_function = properties.finish_function

    this.kill_timer = this.game_state.game.time.create();
    this.kill_timer.add(Phaser.Timer.SECOND * properties.duration, this.kill, this);
    this.kill_timer.start();
  }

  kill () {
    super.kill()
    this.message_text.kill();
    if(this.finish_function){
      this.finish_function()
    }
    this.game_state.currentState.nextState();
  }
}
