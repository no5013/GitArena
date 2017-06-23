import Command from './Command'

export default class extends Command {
  constructor (game, unit, coordinate) {
    super(game, unit)
    this.coordinate = coordinate
  }

  execute () {
    this.executing = true
    var self = this
    this.game.moveUnit(this.unit, this.coordinate.x, this.coordinate.y, function(){
      self.executing = false
    })
  }

  isFinish () {
    return this.executing;
  }
}
