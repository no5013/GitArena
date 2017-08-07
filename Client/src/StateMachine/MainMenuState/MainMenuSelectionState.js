import MainMenuState from './MainMenuState'
import TextPrefab from '../../prefabs/TextPrefab'
import Prefab from '../../prefabs/Prefab'

export default class extends MainMenuState{
  constructor(game_state){
    super(game_state)
    this.menu_title_background = new Prefab(this.game_state, "main_menu_title_background",{x:200,y:100}, {
      group: "hud",
      texture: "menu_item_image",
      anchor: {
        x:0.5,
        y:0.5
      },
      width: 400,
      height: 75
    })
    this.menu_title = new TextPrefab(this.game_state, "main_menu_title_text",{x:200,y:100}, {
      group: "hud",
      text: "MAIN MENU",
      style: Object.create(this.game_state.MENU_TEXT_STYLE),
      anchor: {
        x:0.5,
        y:0.5
      }
    })
    this.menu_title_background.tint = 0x000000
    this.prefabs.push(this.menu_title)
    this.prefabs.push(this.menu_title_background)
    this.hidePrefabs()
  }

  enterState(){
    this.game_state.enableMainMenuHud()
    this.showPrefabs()
  }

  leaveState(){
    this.game_state.disableMainMenuHud()
    this.hidePrefabs()
  }
}
