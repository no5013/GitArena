import Unit from '../prefabs/unit/unit.js'
import {LanguageJobMapper} from '../config'
import {Jobs} from '../GameData/Jobs' 

export default class {
  constructor(){

  }

  static generateUnitFromRepoData(repo){
    var name = repo.name
    var unit_class = LanguageJobMapper[repo.language.toLowerCase()]
    var unit_job = Jobs[unit_class]
    if(unit_job == null){
      unit_job = Jobs["secret"]
    }
    var unit = new Unit(name, unit_job.sprite_name)
    return unit
  }

  static generateUnitFromJsonData(json_file){
    var name = json_file.name
    var sprite_name = json_file.name
    var unit = new Unit(name, sprite_name)
    return unit
  }


}
