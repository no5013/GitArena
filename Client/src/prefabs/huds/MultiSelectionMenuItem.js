import Phaser from 'phaser'
import TextPrefab from '../TextPrefab'
import Prefab from '../Prefab'

export default class extends Prefab{
  constructor (game_state, name, position, properties) {
    super(game_state, name, position, properties)
    this.owner = properties.owner
    this.item = properties.item
    this.inputEnabled = true
    this.isSelected = false
    this.texts = []

    if(properties.text!=null){
      this.text = new TextPrefab(game_state, name, position, properties)
      this.texts.push(this.text)
    }
    // var text = new TextPrefab(game_state, name, {x: 0,y: 0}, properties)
    // this.addChild(text)


    this.events.onInputDown.add(this.select, this)
    this.events.onInputOver.add(this.selectionOver, this)
    this.events.onInputOut.add(this.selectionOut, this)
  }

  selectionOver () {
    if(this.isSelected)
    return;

    this.text.fill = "#FFFF00"
  }

  selectionOut () {
    if(this.isSelected)
    return;

    this.text.fill ="#FFFFFF"
  }

  selected (item) {
    this.text.fill = "#FF0000"
  }

  deSelected (item) {
    this.text.fill ="#FFFFFF"
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

  setVisible(bool){
    this.visible = bool
    this.texts.forEach(function(text){
      text.visible = bool
    },this)
  }
}
