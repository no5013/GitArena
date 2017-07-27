import Job from '../Jobs/Job'
import {UnitStat} from './UnitStat'
import {SkillData} from './SkillData'

export const Jobs = {
  swordman: new Job ({
    name: "swordman",
    sprite_name: "hero_1",
    stats:{
      health: 5,
      attack: 2,
      magic_attack: 0,
      defence: 2,
      speed: 1,
      accuracy: 1,
      attack_range: 3
    },
    skills: [
      SkillData.super_hit,
      SkillData.heal
    ]
  }),
  archer: new Job ({
    name: "archer",
    sprite_name: "hero_2",
    stats:{
      health: 5,
      attack: 2,
      magic_attack: 0,
      defence: 2,
      speed: 1,
      accuracy: 1,
      attack_range: 5
    },
    skills: [
      SkillData.snipe,
      SkillData.heal
    ]
  }),
  secret: new Job({
    name: "secret",
    sprite_name: "hero_3",
    stats:{
      health: 5,
      attack: 2,
      magic_attack: 0,
      defence: 2,
      speed: 1,
      accuracy: 1,
      attack_range: 3
    },
    skills: [
      SkillData.super_hit,
      SkillData.heal
    ]
  })
}
