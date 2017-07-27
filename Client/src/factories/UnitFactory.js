import Unit from '../prefabs/unit/Unit'
import MonsterUnit from '../prefabs/unit/MonsterUnit'
import HeroUnit from '../prefabs/unit/HeroUnit'
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
    console.log(unit_job)
    var unit = new HeroUnit(name, unit_job)
    console.log("WTF IS GOING ON")
    return unit
  }

  static generateUnitFromJsonData(json_file){
    var name = json_file.name
    var stats = json_file.stats
    var sprite_name = json_file.name
    var unit = new MonsterUnit(name, stats, sprite_name)
    return unit
  }


}
