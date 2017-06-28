import Phaser from 'phaser'
import Prefab from '../Prefab'

export default class extends Prefab {
  constructor(game_state, name, position, properties){
    super(game_state, name, position, properties)
  }



  use (target){
    console.log("USE SKILL TO " + target.name)
  }
}
