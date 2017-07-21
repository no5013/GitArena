import MainMenuState from './MainMenuState'
import LevelFactory from '../../factories/LevelFactory'

var $ = require("jquery");

export default class extends MainMenuState{
  constructor(game_state){
    super(game_state)
  }

  enterState(){
    var self = this
    $.get(`http://localhost:8000/matchs/matchmaking`, function(data, status){
      var enemies = [
        {
          "name": "baddie"
        },
        {
          "name": "dude"
        }
      ]
      // var enemies = data.units.slice(0,4)
      self.game_state.properties.ActionStateVar['level'] = LevelFactory.generateLevelFromEnemies(enemies)
      self.nextState()
    })
  }

  leaveState(){
    this.game_state.disableUnitSelectionMenuHud()
  }

  nextState(){
    this.game_state.setMainMenuState(this.game_state.MainMenuState.UnitSelectionState)
  }
}
