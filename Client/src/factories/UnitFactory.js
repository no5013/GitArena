import Unit from '../prefabs/unit/unit.js'

export default class {
  constructor(){

  }

  static generateUnitFromRepoData(repo){
    var name = repo.name
    var sprite_name = "hero_8"
    var unit = new Unit(name, sprite_name)
    return unit
  }

  static generateUnitFromJsonData(json_file){
    var name = json_file.name
    var sprite_name = json_file.name
    var unit = new Unit(name, sprite_name)
    return unit
  }


}
