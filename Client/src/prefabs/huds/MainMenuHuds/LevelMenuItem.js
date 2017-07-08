import Phaser from 'phaser'
import MenuItem from '../MenuItem'

export default class extends MenuItem{
  constructor (game_state, name, position, properties) {
    super(game_state, name, position, properties)
    this.game_state.properties.ActionStateVar['level'] = properties.level
  }

  select () {
    this.game_state.currentState.setNextState(this.game_state.MainMenuState.UnitSelectionState)
    this.game_state.currentState.nextState();
    // this.game_state.game.state.start('Boot', true, false, "assets/levels/battle.json", `assets/levels/level${this.level}.json`, "Game")
  }
}
