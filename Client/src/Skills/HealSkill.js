import Phaser from 'phaser'
import Skill from '../skills/Skill'

export default class extends Skill {
  constructor({name,range,damage,sprite_name}){
    super({name,range,damage,sprite_name})
  }

  use (target){
    target.heal(this.damage)
  }
}
