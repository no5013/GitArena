export default class {
  constructor (game_state) {
    this.game_state = game_state;
    this.next_state = this
    this.previous_state = this
    this.prefabs = []
  }

  enterState () {

  }

  leaveState () {

  }

  showPrefabs(){
    this.prefabs.forEach(function(prefab){
      prefab.visible = true
    },this)
  }

  hidePrefabs(){
    this.prefabs.forEach(function(prefab){
      prefab.visible = false
    },this)
  }

  setNextState(state) {
    this.next_state = state
  }

  nextState () {
    this.game_state.setMainMenuState(this.next_state)
  }

  backState () {
    this.game_state.setMainMenuState(this.previous_state)
  }

  setPreviousState(state) {
    this.previous_state = state
  }
}
