import Phaser from 'phaser'
import MenuItem from '../MenuItem'
import LevelFactory from '../../../factories/LevelFactory'

export default class extends MenuItem{
  constructor (game_state, name, position, properties) {
    super(game_state, name, position, properties)
    this.level = properties.level
  }

  select () {
    this.game_state.properties.ActionStateVar['level'] = LevelFactory.generateLevelFromLevelJSON(this.level)
    this.game_state.currentState.setNextState(this.game_state.MainMenuState.UnitSelectionState)
    this.game_state.currentState.nextState();
  }
}
