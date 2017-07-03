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
    this.load.image('mushroom', 'assets/images/mushroom2.png')
    this.load.tilemap('level0', 'assets/tilemaps/level1.json', null, Phaser.Tilemap.TILED_JSON)
    // this.load.tilemap('level1', 'assets/tilemaps/level1_ColliderLayer.csv', null, Phaser.Tilemap.CSV)
    // this.load.tilemap('level1', 'assets/tilemaps/level1_PlayFieldLayer.csv', null, Phaser.Tilemap.CSV)
    this.load.tilemap('level1', 'assets/tilemaps/level1.csv', null, Phaser.Tilemap.CSV)
    this.load.image('gameTiles', 'assets/images/gametiles.png')
  }

  create () {
    this.state.start('Game')
  }
}
