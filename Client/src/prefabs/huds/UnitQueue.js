import Phaser from 'phaser'
import Prefab from '../Prefab'

export default class extends Prefab{
  constructor (game_state, name, position, properties) {
    super(game_state, name, position, properties)
    this.menu_items = properties.menu_items
    this.current_item_index = 0
  }

  findItemIndex (text) {
    var item_index = 0
    this.menu_items.forEach(function(menu_item){
      if(menu_item.text === text){
        return item_index
      }
      else{
        item_index++;
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

  updateQueue(list){
    var new_order = []
    var new_index = 0
    list.forEach(function(unit){
      var old_index = this.findItemIndex(unit.name)
      new_order.push({
        old_index: old_index,
        new_index: new_index++
      })
    },this)
  }
}
