import Phaser from 'phaser'

export default class {
  constructor (game, unit) {
    this.game = game
    this.unit = unit
    this.executing = false
  }

  execute () {
    this.executing = true
    this.executing = false
  }

  isFinish () {
    return this.executing;
  }
}
