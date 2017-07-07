import Phaser from 'phaser'
import TextPrefab from '../TextPrefab'

export default class extends TextPrefab{
  constructor (game_state, name, position, properties) {
    super(game_state, name, position, properties)
    this.menu_items = properties.menu_items
    this.owner = properties.owner
    this.item = properties.item
    this.inputEnabled = true
    this.isSelected = false
  }

  selectionOver (item) {
    if(this.isSelected)
      return;

    if(item){
      item.fill = "#FFFF00"
    }
    else {
      this.fill = "#FFFF00"
    }
  }

  selectionOut (item) {
    if(this.isSelected)
      return;

    if(item){
      item.fill = "#FFFFFF"
    }
    else {
      this.fill ="#FFFFFF"
    }
  }

  selected (item) {
    if(item){
      item.fill = "#FF0000"
    }
    else {
      this.fill = "#FF0000"
    }
  }

  deSelected (item) {
    if(item){
      item.fill = "#FFFFFF"
    }
    else {
      this.fill ="#FFFFFF"
    }
  }

  select(){
    if(!this.owner.isFull() && !this.isSelected){
      this.isSelected = true
      this.selected()
      this.owner.addToSelected(this)
    }else if(this.isSelected){
      this.isSelected = false
      this.deSelected()
      this.owner.removeFromSelected(this)
    }
  }
}
