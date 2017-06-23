import Phaser from 'phaser'
import TextPrefab from '../TextPrefab'

export default class extends TextPrefab{
  constructor (game_state, name, position, properties) {
    super(game_state, name, position, properties)
    this.inputEnabled = true
    this.events.onInputDown.add(this.select, game_state)
  }

  selectionOver () {
    this.fill = "#FFFF00"
  }

  selectionOut () {
    this.fill ="#FFFFFF"
  }

  select(){
    console.log("CLICK ITEM")
  }


}
