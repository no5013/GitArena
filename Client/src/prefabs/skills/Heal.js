import Phaser from 'phaser'
import Prefab from '../Prefab'
import Skill from '../skills/Skill'

export default class extends Skill {
  constructor(game_state, name, position, properties){
    super(game_state, name, position, properties)
    this.name = name
  }

  use (target){
    target.health += 5
  }
}
