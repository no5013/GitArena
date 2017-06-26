import ActionCommand from './ActionCommand'

const tile_size_x = 32
const tile_size_y = 32

export default class extends ActionCommand {
  constructor (game_state, name, position, properties) {
    super(game_state, name, position, properties)

    this.action_message_text = "Move " + this.owner.name
  }

  execute () {
    var unit = this.owner.name
    var to_tile_x = properties.coordinate.x
    var to_tile_y = properties.coordinate.y

    var from_tile_x = this.game_state.layer.getTileX(unit.x);
    var from_tile_y = this.game_state.layer.getTileY(unit.y);
    let from_tile = this.game_state.map.getTile(from_tile_x, from_tile_y, this.game_state.layer)

    let to_tile = this.game_state.map.getTile(to_tile_x, to_tile_y, this.game_state.layer)

    unit.moveTo(to_tile_x*tile_size_x, to_tile_y*tile_size_y)
    from_tile.properties['owner'] = null
    to_tile.properties['owner'] = unit
  }
}
