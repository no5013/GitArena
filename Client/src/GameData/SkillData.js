import PhysicalAttackSkill from '../Skills/PhysicalAttackSkill'
import HealSkill from '../Skills/HealSkill'

export const SkillData = {
  super_hit: new PhysicalAttackSkill({
    name: "LUCKY PUNCH",
    range: 2,
    damage: 10
  }),
  heal: new HealSkill({
    name: "HEAL",
    range: 3,
    damage: 5
  }),
  snipe: new PhysicalAttackSkill({
    name: "Snipe",
    range: 10,
    damage: 20
  })
}
