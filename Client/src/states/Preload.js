import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init () {}

  preload () {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    centerGameObjects([this.loaderBg, this.loaderBar])

    this.load.setPreloadSprite(this.loaderBar)
    //
    // load your assets
    //
    game.load.image('tiles', 'assets/tiles/gridtiles.png')

    game.load.image('rectangle_image', 'assets/huds/rectangle.png')

    game.load.spritesheet('chara', 'assets/images/vx_chara01.png', 32, 48);

    this.load.tilemap('level0', 'assets/tilemaps/level1.json', null, Phaser.Tilemap.TILED_JSON)

    this.load.image('gameTiles', 'assets/images/gametiles.png')
  }

  create () {
    this.state.start('Game')
  }
}
