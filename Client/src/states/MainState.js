'use strict';

import Phaser from 'phaser'

import RepoHero from '../sprites/RepoHero'

var $ = require("jquery");

export default class extends Phaser.State {

  init () {
		this.score = 0;
    console.log("HOORAY")
	}
  preload () {
		game.load.image('sky', '../assets/images/sky.png')
		game.load.image('ground', '../assets/images/platform.png')
		game.load.image('star', '../assets/images/star.png')
		game.load.spritesheet('dude', '../assets/images/dude.png', 32, 48);
		game.load.spritesheet('chara', '../assets/images/vx_chara01.png', 32, 48);
    // this.game.players.forEach(function(player) {
    //   console.log(player)
    // })
	}

  create () {

		game.physics.startSystem(Phaser.Physics.ARCADE)

		game.add.sprite(0,0, 'sky')

		this.platforms = game.add.group()
		let platforms = this.platforms

		platforms.enableBody = true;

		var ground = platforms.create(0, game.world.height - 64, 'ground');

		ground.scale.setTo(2, 2)

		ground.body.immovable = true;

		let ledge = platforms.create(400, 400, 'ground')

		ledge.body.immovable = true

		ledge = platforms.create(-150, 250, 'ground')

		ledge.body.immovable = true;





		//Control
		this.cursors = game.input.keyboard.createCursorKeys()

		this.stars = game.add.group()
		let stars = this.stars

		stars.enableBody = true

		for (var i=0; i<12; i++){
			var star = stars.create(i*70, 0, 'star')
			star.body.gravity.y = 100
			star.body.bounce.y = 0.7 + Math.random() * 0.2
		}

		//score ui
		this.scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    var start_x = 50
    var start_y = 50

    this.game.player = new RepoHero({
      game: this,
      x: start_x,
      y: start_y,
      asset: 'chara',
      name: this.game.user.username
    })
    this.game.add.existing(this.game.player)

		// this.game.add.existing(this.hero)
		// this.game.add.existing(this.enemy)
  }

	update () {
		let player = this.game.player
		let platforms = this.platforms
		let stars = this.stars
		let cursors = this.cursors

		var hitPlatform = game.physics.arcade.collide(player, platforms);

		game.physics.arcade.collide(stars, platforms)

		game.physics.arcade.overlap(player, stars, collectStar, null, this)

		function collectStar (player, star) {
			star.kill()

			this.score += 10;
			this.scoreText.text = 'score:' + this.score;
		}
	}

  render () {
		game.debug.cameraInfo(game.camera, 32, 32);
  }
}
