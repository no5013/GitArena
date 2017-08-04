import MainMenuState from './MainMenuState'
import UnitFactory from '../../factories/UnitFactory'
import LevelFactory from '../../factories/LevelFactory'
import Prefab from '../../prefabs/Prefab'
import {GameSetting} from '../../config'

var $ = require("jquery");

export default class extends MainMenuState{
  constructor(game_state){
    super(game_state)
  }

  enterState(){
    var loading_prefab = new Prefab(this.game_state, "load", {x:this.game_state.game.world.centerX, y:this.game_state.game.world.centerY}, {
      group: "hud",
      texture: "load"
    })
    loading_prefab.anchor.setTo(0.5,0.5)
    loading_prefab.animations.add("loading")
    loading_prefab.animations.play("loading", 10, true)

    var self = this
    $.get(`http://localhost:8000/matchs/matchmaking`, function(data, status){
      var enemies = []
      console.log(data)

      //load avatar
      self.game_state.load.image("enemy_avatar", data.user_data_from_git.avatar_url)
      self.game_state.load.start()

      data.units.forEach(function(repo){
        enemies.push(UnitFactory.generateUnitFromRepoData(repo))
      },this)
      self.game_state.properties.ActionStateVar['level'] = LevelFactory.generateLevelFromEnemies(enemies)
      // wait for second after load finished
      game.time.events.add(Phaser.Timer.SECOND, function(){
        loading_prefab.kill()
        self.nextState()
      }, this);
    })
  }

  leaveState(){
    this.game_state.disableUnitSelectionMenuHud()
  }

  nextState(){
    this.game_state.setMainMenuState(this.game_state.MainMenuState.UnitSelectionState)
  }
}
