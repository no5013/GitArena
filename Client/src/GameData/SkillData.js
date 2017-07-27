import PhysicalAttackSkill from '../Skills/PhysicalAttackSkill'
import HealSkill from '../Skills/HealSkill'

export const SkillData = {
  super_hit: new PhysicalAttackSkill({
    name: "LUCKY PUNCH"
  }),
  heal: new HealSkill({
    name: "HEAL"
  })
}
