import Phaser from 'phaser'
import Skill from '../skills/Skill'

export default class extends Skill {
  constructor({name,range,damage,sprite_name,special_range}){
    super({name,range,damage,sprite_name,special_range})
  }

  use (target){
    target.heal(this.damage)
  }
}
