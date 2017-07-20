import Phaser from 'phaser'
import MenuItem from './MenuItem'
import NormalAttackCommand from '../../commands/NormalAttackCommand'

export default class extends MenuItem{
  constructor (game_state, name, position, properties) {
    super(game_state, name, position, properties)
  }

  selectionOut () {

  }

  selectionOver () {

  }
}
