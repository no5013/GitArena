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



		this.player = game.add.sprite(32, game.world.height - 150, 'chara')
		let player = this.player

		game.physics.arcade.enable(player)

		player.body.bounce.y = 0.2
		// player.body.gravity.y = 300
		player.body.collideWorldBounds = true;

		player.animations.add('down', [0, 1, 2, 1], 5, true)
		player.animations.add('left', [12, 13, 14, 13], 5, true)
		player.animations.add('right', [24, 25, 26, 25], 5, true)
		player.animations.add('top', [36, 37, 38, 37], 5, true)

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

		// this.hero = new RepoHero({
		// 	game: this,
		// 	x: 200,
		// 	y: 200,
		// 	asset: 'chara',
		// 	name: this.game.player_name,
		// })
    //
		// this.enemy = new RepoHero({
		// 	game: this,
		// 	x: 400,
		// 	y: 200,
		// 	asset: 'chara',
		// 	name: 'Enemy',
		// })
    var runner = 0
    var start_x = 50
    var start_y = 50
    var ore = this

    this.game.players.forEach(function(player) {
      let new_player = new RepoHero({
        game: ore,
        x: start_x,
        y: start_y,
        asset: 'chara',
        name: player
      })
      start_x+=50
      start_y+=50
      ore.game.add.existing(new_player)
    })

		// this.game.add.existing(this.hero)
		// this.game.add.existing(this.enemy)
  }

	update () {
		let player = this.player
		let platforms = this.platforms
		let stars = this.stars
		let cursors = this.cursors

		var hitPlatform = game.physics.arcade.collide(player, platforms);

		game.physics.arcade.collide(stars, platforms)

		game.physics.arcade.overlap(player, stars, collectStar, null, this)

		player.body.velocity.x = 0
		player.body.velocity.y = 0

		if(cursors.left.isDown){
			player.body.velocity.x = -150
			player.animations.play('left')
		}
		else if (cursors.right.isDown) {
			player.body.velocity.x = 150
			player.animations.play('right')
		}
		else if (cursors.up.isDown) {
			player.body.velocity.y = -150
			player.animations.play('top')
		}
		else if (cursors.down.isDown) {
			// player.body.velocity.y = 150
			// player.animations.play('down')
			// this.hero.attack(this.enemy)
		}
		else {
			player.animations.stop()
			player.frame = 2
		}

		function collectStar (player, star) {
			star.kill()

			this.score += 10;
			this.scoreText.text = 'score:' + this.score;
		}
	}

  render () {
		game.debug.cameraInfo(game.camera, 32, 32);
    game.debug.spriteCoords(this.player, 32, 500);
  }
}
