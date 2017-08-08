import PhysicalAttackSkill from '../Skills/PhysicalAttackSkill'
import HealSkill from '../Skills/HealSkill'
import {SkillType} from '../Skills/SkillType'

export const SkillData = {
  super_hit: new PhysicalAttackSkill({
    name: "Wide slash",
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
    ],
    type: SkillType.MAP
  }),
  heal: new HealSkill({
    name: "HEAL",
    range: 3,
    damage: 5,
    type: SkillType.NORMAL
  }),
  snipe: new PhysicalAttackSkill({
    name: "Snipe",
    range: 10,
    damage: 10,
    sprite_name: "slash",
    type: SkillType.NORMAL
  }),
  getter_beam: new PhysicalAttackSkill({
    name: "GETTER BEAM",
    range: 10,
    damage: 15,
    sprite_name: "slash",
    special_range: [
      {
        x:0,
        y:1
      },
      {
        x:0,
        y:2
      },
      {
        x:0,
        y:3
      },
      {
        x:0,
        y:4
      },
      {
        x:0,
        y:5
      },
      {
        x:0,
        y:6
      },
      {
        x:1,
        y:1
      },
      {
        x:1,
        y:2
      },
      {
        x:1,
        y:3
      },
      {
        x:1,
        y:4
      },
      {
        x:1,
        y:5
      },
      {
        x:1,
        y:6
      },
      {
        x:-1,
        y:1
      },
      {
        x:-1,
        y:2
      },
      {
        x:-1,
        y:3
      },
      {
        x:-1,
        y:4
      },
      {
        x:-1,
        y:5
      },
      {
        x:-1,
        y:6
      },
    ],
    type: SkillType.MAP
  })
}
