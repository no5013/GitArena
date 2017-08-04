import Phaser from 'phaser'
import Prefab from '../Prefab'

export default class extends Prefab{
  constructor (game_state, name, position, properties) {
    super(game_state, name, position, properties)
    this.menu_items = properties.menu_items
    this.current_item_index = 0
  }

  findItemIndex (text) {
    for(let i=0; i<this.menu_items.length; i++){
      var menu_item = this.menu_items[i]
      if(menu_item.text === text){
        return i
      }
    }
  }

  removeItem (index) {
    var menu_item = this.menu_items[index]
    this.menu_items.splice(index, 1)
    if(this.current_item_index === index) {
      this.current_item_index = 0
    }
    return menu_item
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

  updateQueue(list){
    this.hide()
    var new_order = []
    var new_index = 0
    list.forEach(function(unit){
      var old_index = this.findItemIndex(unit.text)
      if(old_index!=null){
        new_order.push({
          name: unit.text,
          old_index: old_index,
          new_index: new_index++
        })
      }
    },this)
    this.menu_items = list
    this.show()
    console.log(new_order)
  }
}
