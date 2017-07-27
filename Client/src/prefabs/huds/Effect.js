import Phaser from 'phaser'
import Prefab from '../Prefab'
import TextPrefab from '../TextPrefab'

export default class extends Prefab {
  constructor (game_state, name, position, properties) {
    super(game_state, name, position ,properties)
    this.anchor.setTo(0.5,0.5)

    var self = this
    var animation = this.animations.add("animation")
    animation.onComplete.add(function(){
      self.kill()
    })
    animation.play(10,false)
  }
}
