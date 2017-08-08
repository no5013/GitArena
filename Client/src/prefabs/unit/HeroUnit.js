import Unit from './Unit'

var exp_per_level = 4
var exp_per_commit = 10

export default class extends Unit {
  constructor(name, job, commits_count, added_count, open_issues_count){
    var level = Math.floor((commits_count*exp_per_commit)/exp_per_level)
    var weak_level = Math.min(open_issues_count, 5)
    var stats = {
      health: job.stats.health*level * (1.0 - weak_level/10),
      attack: job.stats.attack*level,
      magic_attack: job.stats.magic_attack*level,
      defence: job.stats.defence*level,
      speed: job.stats.speed*level,
      accuracy: job.stats.accuracy*level,
      attack_range: job.stats.attack_range
    }
    super(name, stats, job.sprite_name)
    this.job = job
    this.level = level
  }
}
