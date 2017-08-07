import Phaser from 'phaser'
import Prefab from '../Prefab'
import TextPrefab from '../TextPrefab'

export default class extends Prefab{
  constructor (game_state, name, position, properties) {
    super(game_state, name, position, properties)

    this.HUD_TEXT_STYLE = {font: "24px Arial", fill: "#FFFFFF"}
    this.y_offset = 25
    this.x_offset = 80
    console.log(position)

    this.player_name = new TextPrefab(game_state, "player_name_text", {x: position.x - this.x_offset, y: position.y - this.y_offset}, {
      text: "",
      style: Object.create(this.HUD_TEXT_STYLE),
      group: "hud",
      anchor: {
        x: 0,
        y: 0.5
      }
    })
    this.player_hp = new TextPrefab(game_state, "player_hp_text", {x: position.x - this.x_offset, y: position.y + this.y_offset}, {
      text: "",
      style: Object.create(this.HUD_TEXT_STYLE),
      group: "hud",
      anchor: {
        x: 0,
        y: 0.5
      }
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
