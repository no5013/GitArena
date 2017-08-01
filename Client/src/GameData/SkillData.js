import PhysicalAttackSkill from '../Skills/PhysicalAttackSkill'
import HealSkill from '../Skills/HealSkill'

export const SkillData = {
  super_hit: new PhysicalAttackSkill({
    name: "LUCKY PUNCH",
    range: 2,
    damage: 10,
    sprite_name: "slash",
    special_range: [
      {
        x:1,
        y:1
      },
      {
        x:0,
        y:1
      },
      {
        x:-1,
        y:1
      },
      {
        x:2,
        y:2
      },
      {
        x:0,
        y:2
      },
      {
        x:-2,
        y:2
      }
    ]
  }),
  heal: new HealSkill({
    name: "HEAL",
    range: 3,
    damage: 5
  }),
  snipe: new PhysicalAttackSkill({
    name: "Snipe",
    range: 10,
    damage: 20,
    sprite_name: "slash"
  })
}
