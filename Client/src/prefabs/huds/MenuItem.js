import Phaser from 'phaser'
import TextPrefab from '../TextPrefab'
import Prefab from '../Prefab'

export default class extends Prefab{
  constructor (game_state, name, position, properties) {
    super(game_state, name, position, properties)
    this.inputEnabled = true

    this.text = new TextPrefab(game_state, name, position, properties)

    this.events.onInputDown.add(this.select, this)
    this.events.onInputOver.add(this.selectionOver, this)
    this.events.onInputOut.add(this.selectionOut, this)
  }

  selectionOver () {
      this.text.fill = "#FFFF00"
  }

  selectionOut () {
      this.text.fill ="#FFFFFF"
  }

  select(){

  }

  setVisible(bool){
    this.visible = bool
    this.text.visible = bool
  }

}
