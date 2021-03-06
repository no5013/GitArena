import 'pixi'
import 'p2'
import Phaser from 'phaser'

import BootState from './states/Boot'
import PreloadState from './states/Preload'
import LoadingState from './states/LoadingState'
import MainMenuState from './states/MainMenuState'
import GameState from './states/Game'
import LoginState from './states/LoginState'

import Util from './util/Util'

import {GameSetting} from './config'

class Game extends Phaser.Game {
  constructor () {
    const docElement = document.documentElement
    // const width = docElement.clientWidth > GameSetting.gameWidth ? GameSetting.gameWidth : docElement.clientWidth
    // const height = docElement.clientHeight > GameSetting.gameHeight ? GameSetting.gameHeight : docElement.clientHeight
    const width = GameSetting.gameWidth
    const height = GameSetting.gameHeight

    super(width, height, Phaser.CANVAS, 'content', null)

    //add state
    this.state.add('Boot', BootState, false)
    this.state.add('Preload', PreloadState, false)
    this.state.add('Game', GameState, false)
    this.state.add('Loading', LoadingState, false)
    this.state.add('MainMenu', MainMenuState, false)
    this.state.add('Login', LoginState, false)

    // this.state.start('Boot', true, false, "assets/levels/battle.json", "assets/levels/level.json", "Game")
    this.state.start('Boot', true, false, "assets/levels/login.json", "Login")
  }
}

window.game = new Game()
