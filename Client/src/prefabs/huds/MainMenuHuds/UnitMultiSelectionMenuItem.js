import MultiSelectionMenuItem from '../MultiSelectionMenuItem'
import Prefab from '../../Prefab'
import TextPrefab from '../../TextPrefab'

export default class extends MultiSelectionMenuItem {
  constructor (game_state, name, position, properties) {
    super(game_state, name, position, properties)
    this.unit = properties.item

    this.level = new TextPrefab(game_state, name, {x: position.x-200, y: position.y}, {
      text: "LV: " + this.unit.level,
      group: "hud",
      style: properties.style,
      anchor: {
        x: 0,
        y: 0.5
      }
    })
    this.texts.push(this.level)

    this.name = new TextPrefab(game_state, name, {x: position.x-100, y: position.y}, {
      text: "NAME: " + this.unit.name,
      group: "hud",
      style: properties.style,
      anchor: {
        x: 0,
        y: 0.5
      }
    })
    this.texts.push(this.name)

    this.job = new TextPrefab(game_state, name, {x: position.x+110, y: position.y}, {
      text: "CLASS: " + this.unit.job.name,
      group: "hud",
      style: properties.style,
      anchor: {
        x: 0,
        y: 0.5
      }
    })
    this.texts.push(this.job)
  }

  selectionOver () {
    if(this.isSelected)
    return;

    this.tint = 0xffff00
  }

  selectionOut () {
    if(this.isSelected)
    return;

    this.tint = 0xffffff
  }

  selected (item) {
    this.tint = 0xff0000
  }

  deSelected (item) {
    this.tint = 0xffffff
  }
}
