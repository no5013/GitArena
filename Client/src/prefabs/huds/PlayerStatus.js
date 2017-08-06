import Phaser from 'phaser'
import Prefab from '../Prefab'
import TextPrefab from '../TextPrefab'

export default class extends Prefab{
  constructor (game_state, name, position, properties) {
    super(game_state, name, position, properties)

    this.HUD_TEXT_STYLE = {font: "24px Arial", fill: "#FFFFFF"}
    this.space_between_text = 35;
    console.log(position)

    this.player_name = new TextPrefab(game_state, "player_name_text", {x: position.x, y: position.y}, {
      text: "",
      style: Object.create(this.HUD_TEXT_STYLE),
      group: "hud"
    })
    this.player_hp = new TextPrefab(game_state, "player_hp_text", {x: position.x, y: position.y + this.space_between_text}, {
      text: "",
      style: Object.create(this.HUD_TEXT_STYLE),
      group: "hud"
    })
  }

  show () {
    this.player_name.visible = true
    this.player_hp.visible = true
  }

  hide () {
    this.player_name.visible = false
    this.player_hp.visible = false
  }

  setPlayer (unit){
    this.player_name.setText(`NAME: ${unit.name}`)
    this.player_hp.setText(`HP: ${unit.health}`)
  }

}
