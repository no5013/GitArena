import Job from './Jobs/Job'

export const GameSetting = {
  gameWidth: 800,
  gameHeight: 600,
  localStorageName: 'phaseres6webpack'
}

export const UnitStat = {
  HEALTH: "health",
  ATTACK: "attack",
  MAGIC_ATTACK: "magic_attack",
  DEFENCE: "defence",
  SPEED: "speed",
  ACCURACY: "accuracy"
}

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
      accuracy: 1
    }
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
      accuracy: 1
    }
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
      accuracy: 1
    }
  })
}

export const LanguageJobMapper = {
  ruby: "swordman",
  html: "swordman",
  javascript: "archer",
  java: "swordman"
}
