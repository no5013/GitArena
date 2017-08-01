import Phaser from 'phaser'
import TextPrefab from '../TextPrefab'

export default class extends TextPrefab{
  constructor (game_state, name, position, properties) {
    super(game_state, name, position, properties)
    this.inputEnabled = true
    this.events.onInputDown.add(this.select, this)
    this.events.onInputOver.add(this.selectionOver, this)
    this.events.onInputOut.add(this.selectionOut, this)
  }

  selectionOver () {
      this.fill = "#FFFF00"
  }

  selectionOut () {
      this.fill ="#FFFFFF"
  }

  select(){

  }

}
