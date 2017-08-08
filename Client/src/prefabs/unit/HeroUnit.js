import Unit from './Unit'



export default class extends Unit {
  constructor(name, job, commits_count, added_count, open_issues_count){
    // var exp_per_level = 4
    // var exp_per_commit = 10
    // var level = Math.floor((commits_count*exp_per_commit)/exp_per_level)
    var level = 1
    var exp_per_level = 2
    var remaining_exp = commits_count*1
    while(remaining_exp>=exp_per_level){
      level++;
      remaining_exp-=exp_per_level
      exp_per_level*=1.5
    }

    var weak_level = Math.min(open_issues_count, 5)
    var stats = {
      health: Math.floor(job.stats.health*level * (1.0 - weak_level/10)),
      attack: Math.floor(job.stats.attack*level * (1.0 - weak_level/10)),
      magic_attack: Math.floor(job.stats.magic_attack*level * (1.0 - weak_level/10)),
      defence: Math.floor(job.stats.defence*level * (1.0 - weak_level/10)),
      speed: Math.floor(job.stats.speed*level * (1.0 - weak_level/10)),
      accuracy: Math.floor(job.stats.accuracy*level * (1.0 - weak_level/10)),
      attack_range: job.stats.attack_range
    }
    super(name, stats, job.sprite_name)
    this.job = job
    this.level = level
  }
}
