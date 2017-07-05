import ActionCommand from './ActionCommand'

const tile_size_x = 32
const tile_size_y = 32

export default class extends ActionCommand {
  constructor (game_state, name, position, properties) {
    super(game_state, name, position, properties)
    this.properties = properties
  }

  execute () {
    this.game_state.used_commands["Attack"] = true

    var unit = this.owner
    var target = this.properties.target

    this.action_message_text = unit.name + " ATTACK " + target.name

    //make camera follow unit and unfollow when it finish action
    this.game_state.game.camera.follow(unit)
    this.properties.finish_function = function(){
      this.game_state.game.camera.follow(null)
    }
    unit.attack(target)

    this.showMessage();
  }
}
