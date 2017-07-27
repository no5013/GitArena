import Phaser from 'phaser'

export default class {
  constructor({name}){
    this.name = name
    this.range = 5
  }

  use (target){
    target.takeDamage(10)
  }
}
