import Level from '../prefabs/level/level.js'

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
    var level = new Level(name, map, enemies, reward)
    return level
  }


}
