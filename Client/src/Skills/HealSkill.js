import Phaser from 'phaser'
import Skill from '../skills/Skill'

export default class extends Skill {
  constructor({name}){
    super({name})
  }

  use (target){
    target.heal(5)
  }
}
