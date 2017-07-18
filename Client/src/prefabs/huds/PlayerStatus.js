import Phaser from 'phaser'
import Prefab from '../Prefab'

export default class extends Prefab{
  constructor (game_state, name, position, properties) {
    super(game_state, name, position, properties)
    this.menu_items = properties.menu_items
    this.current_item_index = 0
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
