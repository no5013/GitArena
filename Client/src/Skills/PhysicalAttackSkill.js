import Phaser from 'phaser'
import Skill from '../skills/Skill'

export default class extends Skill {
  constructor({name,range,damage,sprite_name,special_range}){
    super({name,range,damage,sprite_name,special_range})
  }

  use (target){
    target.takeDamage(this.damage)
  }

  // getSkillRangeCoordinate(direction){
  //   var possibleAttack = [
  //     {
  //       x:1,
  //       y:1
  //     },
  //     {
  //       x:0,
  //       y:1
  //     },
  //     {
  //       x:-1,
  //       y:1
  //     },
  //     {
  //       x:2,
  //       y:2
  //     },
  //     {
  //       x:0,
  //       y:2
  //     },
  //     {
  //       x:-2,
  //       y:2
  //     }
  //   ]
  //
  //   if(direction == "up"){
  //     var newPossibleAttack = []
  //     possibleAttack.forEach(function(attack){
  //       newPossibleAttack.push({
  //         x:attack.x,
  //         y:-attack.y
  //       })
  //     },this)
  //     return newPossibleAttack;
  //   }
  //   else if(direction == "right"){
  //     var newPossibleAttack = []
  //     possibleAttack.forEach(function(attack){
  //       newPossibleAttack.push({
  //         x:attack.y,
  //         y:attack.x
  //       })
  //     },this)
  //     return newPossibleAttack;
  //   }
  //   else if(direction == "left"){
  //     var newPossibleAttack = []
  //     possibleAttack.forEach(function(attack){
  //       newPossibleAttack.push({
  //         x:-attack.y,
  //         y:attack.x
  //       })
  //     },this)
  //     return newPossibleAttack;
  //   }
  //   return possibleAttack
  // }
}
