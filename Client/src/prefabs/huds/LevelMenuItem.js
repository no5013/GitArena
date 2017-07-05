import Phaser from 'phaser'
import MenuItem from './MenuItem'

export default class extends MenuItem{
  constructor (game_state, name, position, properties) {
    super(game_state, name, position, properties)
    this.level = properties.level
  }

  select () {
    this.game_state.game.state.start('Boot', true, false, "assets/levels/battle.json", `assets/levels/level${this.level}.json`, "Game")
  }
}
