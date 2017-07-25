import Phaser from 'phaser'
// import UnitPrefab from './RepoHero'
import UnitPrefab from './UnitPrefab'

export default class PlayerUnit extends UnitPrefab{
  constructor (game, name, position, properties) {
    // super(game, x, y, asset, name, health, num, properties)
    super(game, name, position, properties)

  }

  act () {

  }
}
