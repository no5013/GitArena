import Unit from './Unit'

var exp_per_level = 4
var exp_per_commit = 1000

export default class extends Unit {
  constructor(name, job, commits_count, added_count){
    var level = Math.floor((commits_count*exp_per_commit+added_count)/exp_per_level)
    var stats = {
      health: job.stats.health*level,
      attack: job.stats.attack*level,
      magic_attack: job.stats.magic_attack*level,
      defence: job.stats.defence*level,
      speed: job.stats.speed*level,
      accuracy: job.stats.accuracy*level,
      attack_range: job.stats.attack_range
    }
    super(name, stats, job.sprite_name)
    this.job = job
  }
}
