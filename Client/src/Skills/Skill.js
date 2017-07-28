import Phaser from 'phaser'

export default class {
  constructor({name, range, damage, sprite_name}){
    this.name = name
    this.range = range
    this.damage = damage
    this.sprite_name = sprite_name
  }

  use (target){
    target.takeDamage(10)
  }
}
