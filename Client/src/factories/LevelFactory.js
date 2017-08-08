import Level from '../prefabs/level/level.js'
import UnitFactory from './UnitFactory.js'

export default class {
  constructor(){

  }

  static generateLevelFromEnemies(enemies){
    var name = "PVP MATCH"
    var reward = {
      "experience": 100,
      "money": 300
    }
    var map = {
      "key": "level_tilemap",
      "tilesets": ["map_tileset"]
    }
    var max_enemies = 4
    var level = new Level(name, map, enemies.slice(0,max_enemies), reward)
    return level
  }

  static generateLevelFromLevelJSON(level_json){
    var name = level_json.level_name
    var reward = level_json.reward
    var map = level_json.map
    var enemies = []
    var max_enemies = 6
    level_json.enemy_encounters.forEach(function(enemy_json){
      enemies.push(UnitFactory.generateUnitFromJsonData(enemy_json))
    },this)
    var level = new Level(name, map, enemies.slice(0,max_enemies), reward)
    return level
  }


}
