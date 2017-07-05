import Prefab from '../prefabs/Prefab'
import ActionMessage from '../prefabs/huds/ActionMessage'

export default class extends Prefab {
  constructor (game_state, name, position, properties) {
    super(game_state, name, position, properties)

    this.owner = this.game_state.prefabs[properties.owner_name]

    this.action_message_position = new Phaser.Point(400, this.game.world.height * 0.1)
    this.action_message_text = "Action Message"

    this.properties = properties
  }

  showMessage () {
    var action_message = new ActionMessage(this.game_state, this.owner.name + "_action_message", this.action_message_position, {
      group: 'hud',
      texture: 'rectangle_image',
      scale: {x: 1.5, y: 0.5},
      duration: 1,
      message: this.action_message_text,
      finish_function: this.properties.finish_function
    })
  }

  execute () {
    showMessage ()
  }
}
