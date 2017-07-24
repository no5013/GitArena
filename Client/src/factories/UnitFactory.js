import Unit from '../prefabs/unit/unit.js'
import {LanguageJobMapper, Job} from '../config'

export default class {
  constructor(){

  }

  static generateUnitFromRepoData(repo){
    console.log("FUCK")
    var name = repo.name
    var unit_class = LanguageJobMapper[repo.language.toLowerCase()]
    var unit_job = Job[unit_class]
    if(unit_job == null){
      unit_job = Job["secret"]
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
