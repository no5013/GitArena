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

  getSkillRangeCoordinate(){
    var possibleAttack = []

    for(let j=0; j<=this.range; j++){
      for(let i=0; i<=this.range-j; i++){
        if(i==0 && j==0)
        continue;
        possibleAttack.push(
          {
            x:+i,
            y:+j
          },
          {
            x:+i,
            y:-j
          },
          {
            x:-i,
            y:+j
          },
          {
            x:-i,
            y:-j
          }
        )
      }
    }
    return possibleAttack
  }
}
