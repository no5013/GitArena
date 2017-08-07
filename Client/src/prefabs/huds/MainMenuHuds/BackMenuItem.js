import Phaser from 'phaser'
import MenuItem from '../MenuItem'
import LevelFactory from '../../../factories/LevelFactory'

export default class extends MenuItem{
  constructor (game_state, name, position, properties) {
    super(game_state, name, position, properties)
    this.level = properties.level
  }

  select () {
    this.game_state.currentState.backState();
  }
}
