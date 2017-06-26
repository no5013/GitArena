import Phaser from 'phaser'
import Prefab from '../Prefab'
import TextPrefab from '../TextPrefab'

export default class extends TextPrefab {
  constructor (game_state, name, position, properties) {
    super(game_state, name, position ,properties)

    this.anchor.setTo(0.5)
    this.fill = '#FF0000'
    this.align = 'center'
    this.stroke = '#000000'
    this.strokeThickness = 5

    this.fixedToCamera = false

    let self = this

    var text_float = this.game_state.add.tween(this)
    console.log(properties.distance + " " + properties.duration)
    text_float.to({x: self.x, y: self.y - properties.distance}, properties.duration)
    text_float.onComplete.add(function(){
      self.kill()
    })
    text_float.start();
  }
}
