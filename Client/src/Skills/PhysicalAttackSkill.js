import Phaser from 'phaser'
import Skill from '../skills/Skill'

export default class extends Skill {
  constructor({name,range,damage}){
    super({name,range,damage})
  }

  use (target){
    target.takeDamage(this.damage)
  }
}
