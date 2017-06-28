import ActionCommand from './ActionCommand'

const tile_size_x = 32
const tile_size_y = 32

export default class extends ActionCommand {
  constructor (game_state, name, position, properties) {
    super(game_state, name, position, properties)

    this.target = properties.target
    console.log(this.target.name)

    this.action_message_text = this.owner.name + " ATTACK " + this.target.name
  }

  execute () {
    var unit = this.owner

    //make camera follow unit and unfollow when it finish action
    this.game_state.game.camera.follow(unit)
    this.properties.finish_function = function(){
      console.log("camera null")
      this.game_state.game.camera.follow(null)
    }
    unit.attack(this.target)

    this.showMessage();
  }
}
