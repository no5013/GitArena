import Unit from './Unit'

export default class extends Unit {
  constructor(name, job){
    super(name, job.stats, job.sprite_name)
  }
}
