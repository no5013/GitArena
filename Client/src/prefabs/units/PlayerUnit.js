import Phaser from 'phaser'
import RepoHero from './RepoHero'

export default class PlayerUnit extends RepoHero{
  constructor (game, x, y, asset, name, health, num, properties) {
    super(game, x, y, asset, name, health, num, properties)
  }

  act () {

  }
}
