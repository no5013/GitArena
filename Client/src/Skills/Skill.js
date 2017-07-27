import Phaser from 'phaser'

export default class {
  constructor({name}){
    this.name = name
  }

  use (target){
    target.takeDamage(10)
  }
}
