import Phaser from 'phaser'
import Prefab from '../Prefab'

export default class extends Prefab{
  constructor (game_state, name, position, properties) {
    super(game_state, name, position, properties)
    this.menu_items = properties.menu_items
    this.current_item_index = 0
  }

  processInput (event) {
    switch (event.keyCode) {
      case Phaser.Keyboard.UP:
      if (this.current_item_index > 0){
        this.moveSelection(this.current_item_index - 1)
      }
      break;

      case Phaser.Keyboard.DOWN:
      if (this.current_item_index < this.menu_items.length - 1){
        this.moveSelection(this.current_item_index + 1)
      }
      break;

      case Phaser.Keyboard.SPACEBAR:
      this.menu_items[this.current_item_index].select()
      break;
    }
  }

  moveSelection (item_index){
    this.menu_items[this.current_item_index].selectionOut()
    this.current_item_index = item_index
    this.menu_items[this.current_item_index].selectionOver()
  }

  findItemIndex (text) {
    var item_index
    this.menu_items.forEach(function(menu_item){
      if(menu_item.text === text){
        return menu_item
      }
    })
  }

  removeItem (index) {
    var menu_item = this.menu_items[index]
    this.menu_items.splice(index, 1)
    if(this.current_item_index === index) {
      this.current_item_index = 0
    }
    return menu_item
  }

  enable () {
    if(this.menu_items.length > 0) {
      this.menu_items[this.current_item_index].selectionOut()
      this.current_item_index = 0
      this.menu_items[this.current_item_index].selectionOver()
    }
    this.game_state.game.input.keyboard.addCallbacks(this, this.processInput)
  }

  disable () {
    if(this.menu_items.length > 0) {
      this.menu_items[this.current_item_index].selectionOut();
    }
    this.current_item_index = 0
  }

  show () {
    this.menu_items.forEach(function(menu_item){
      menu_item.setVisible(true)
    }, this)
  }

  hide () {
    this.menu_items.forEach(function(menu_item){
      menu_item.setVisible(false)
    }, this)
  }

}
