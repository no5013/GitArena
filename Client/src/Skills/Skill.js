import Phaser from 'phaser'

export default class {
  constructor({name, range, damage, sprite_name, special_range}){
    this.name = name
    this.range = range
    this.damage = damage
    this.sprite_name = sprite_name
    this.special_range = special_range
    console.log(this.special_range)
  }

  use (target){
    target.takeDamage(10)
  }

  getSkillRangeCoordinate(direction){
    var possibleAttack = []

    if(this.special_range==null){
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
    }
    else{
      if(direction == "up"){
        this.special_range.forEach(function(attack){
          possibleAttack.push({
            x:attack.x,
            y:-attack.y
          })
        },this)
      }
      else if(direction == "right"){
        this.special_range.forEach(function(attack){
          possibleAttack.push({
            x:attack.y,
            y:attack.x
          })
        },this)
      }
      else if(direction == "left"){
        this.special_range.forEach(function(attack){
          possibleAttack.push({
            x:-attack.y,
            y:attack.x
          })
        },this)
      }
      else{
        possibleAttack = this.special_range
      }
    }
    return possibleAttack
  }
}
