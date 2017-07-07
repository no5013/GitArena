import Menu from './Menu'

export default class extends Menu {
  constructor (game_state, name, position, properties) {
    super(game_state, name, position, properties)
    this.menu_items = properties.menu_items
    this.maximum_size = properties.maximum_size

    this.current_item_index = 0
    this.current_selected = []
  }

  addToSelected(menu_item) {
    if(this.isFull()){
      console.log("FULL")
    }
    else{
      this.current_selected.push(menu_item)
    }
  }

  isFull(){
    return this.current_selected.length>=this.maximum_size
  }

  removeFromSelected(menu_item) {
    var index = this.current_selected.findIndex(function(o){
      return o.name === menu_item.name
    })
    this.current_selected.splice(index, 1)
    console.log(this.current_selected)
  }
}
