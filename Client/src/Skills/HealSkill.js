import Phaser from 'phaser'
import Skill from '../skills/Skill'

export default class extends Skill {
  constructor({name,range,damage,sprite_name,special_range, type}){
    super({name,range,damage,sprite_name,special_range, type})
  }

  use (target){
    target.heal(this.damage)
  }
}
