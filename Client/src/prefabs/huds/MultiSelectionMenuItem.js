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

    this.events.onInputDown.add(this.select, this)
    this.events.onInputOver.add(this.selectionOver, this)
    this.events.onInputOut.add(this.selectionOut, this)
  }

  selectionOver () {
    if(this.isSelected)
      return;

      this.fill = "#FFFF00"
  }

  selectionOut () {
    if(this.isSelected)
      return;

      this.fill ="#FFFFFF"
  }

  selected (item) {
      this.fill = "#FF0000"
  }

  deSelected (item) {
      this.fill ="#FFFFFF"
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

  show () {
    this.menu_items.forEach(function(menu_item){
      menu_item.visible = true
    }, this)
  }

  hide () {
    this.menu_items.forEach(function(menu_item){
      menu_item.visible = false
    }, this)
  }
}
