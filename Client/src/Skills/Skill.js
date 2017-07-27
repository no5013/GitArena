import Phaser from 'phaser'

export default class {
  constructor({name, range, damage}){
    this.name = name
    this.range = range
    this.damage = damage
  }

  use (target){
    target.takeDamage(10)
  }
}
