import Phaser from 'phaser'
import RepoHero from './RepoHero'

export default class extends RepoHero{
  constructor (game, x, y, asset, name, health, num) {
    super(game, x, y, asset, name, health, num)
  }

  act () {
    let fromTile = this.game.map.getTile(5, 7, game.layer)
    let toTile = this.game.map.getTile(5, 12, game.layer)
    this.game.moveCharacter(this, fromTile, toTile, function(){

    })
    console.log(game)
    console.log("ENEMY")
  }
}
