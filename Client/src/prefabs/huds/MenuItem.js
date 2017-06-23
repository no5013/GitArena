import Phaser from 'phaser'
import TextPrefab from '../TextPrefab'

export default class extends TextPrefab{
  constructor (game_state, name, position, properties) {
    super(game_state, name, position, properties)
    this.inputEnabled = true
    this.events.onInputDown.add(this.select, game_state)
    this.events.onInputOver.add(this.selectionOver, game_state)
    this.events.onInputOut.add(this.selectionOut, game_state)
  }

  selectionOver (item) {
    if(item){
      item.fill = "#FFFF00"
    }
    else {
      this.fill = "#FFFF00"
    }
  }

  selectionOut (item) {
    if(item){
      item.fill = "#FFFFFF"
    }
    else {
      this.fill ="#FFFFFF"
    }
  }

  select(){
    console.log("CLICK ITEM")
  }

}
