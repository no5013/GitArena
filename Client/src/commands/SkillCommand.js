import ActionCommand from './ActionCommand'

const tile_size_x = 32
const tile_size_y = 32

export default class extends ActionCommand {
  constructor (game_state, name, position, properties) {
    super(game_state, name, position, properties)
    this.properties = properties
  }

  execute () {
    this.game_state.used_commands["Skill"] = true
    var unit = this.owner
    var target = this.properties.target
    var skill = this.properties.skill

    console.log(unit.name)
    console.log(skill)
    console.log(target.name)

    this.action_message_text = unit.name + " USE " + skill.name + " ON " + target.name

    //make camera follow unit and unfollow when it finish action
    this.game_state.game.camera.follow(unit)
    this.properties.finish_function = function(){
      console.log("camera null")
      this.game_state.game.camera.follow(null)
    }
    skill.use(target)

    this.showMessage();
  }
}
