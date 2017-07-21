import MainMenuState from './MainMenuState'
import UnitFactory from '../../factories/UnitFactory'
import LevelFactory from '../../factories/LevelFactory'

var $ = require("jquery");

export default class extends MainMenuState{
  constructor(game_state){
    super(game_state)
  }

  enterState(){
    var self = this
    $.get(`http://localhost:8000/matchs/matchmaking`, function(data, status){
      var enemies = []
      data.units.forEach(function(repo){
        enemies.push(UnitFactory.generateUnitFromRepoData(repo))
      },this)
      console.log(enemies)
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
