/* globals __DEV__ */
import Phaser from 'phaser'

export default class extends Phaser.State {

  init () {
		this.score = 0;
	}
  preload () {
		game.load.image('sky', '../assets/images/sky.png')
		game.load.image('ground', '../assets/images/platform.png')
		game.load.image('star', '../assets/images/star.png')
		game.load.spritesheet('dude', '../assets/images/dude.png', 32, 48);
	}

  create () {
		game.physics.startSystem(Phaser.Physics.ARCADE)

		game.add.sprite(0,0, 'sky')

		var platforms = game.add.group()

		platforms.enableBody = true;

		var ground = platforms.create(0, game.world.height - 64, 'ground');

		ground.scale.setTo(2, 2)

		ground.body.immovable = true;

		var ledge = platforms.create(400, 400, 'ground')

		ledge.body.immovable = true

		ledge = platforms.create(-150, 250, 'ground')

		ledge.body.immovable = true;



		this.player = game.add.sprite(32, game.world.height - 150, 'dude')
		let player = this.player

		game.physics.arcade.enable(player)

		player.body.bounce.y = 0.2
		// player.body.gravity.y = 300
		player.body.collideWorldBounds = true;

		player.animations.add('left', [0, 1, 2, 3], 10, true)
		player.animations.add('right', [5, 6, 7, 8], 10, true)

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
		}
		else if (cursors.down.isDown) {
			player.body.velocity.y = 150
		}
		else {
			player.animations.stop()
			player.frame = 4
		}

		function collectStar (player, star) {
			star.kill()

			this.score += 10;
			this.scoreText.text = 'score:' + this.score;
		}
	}

  // render () {
  //   if (__DEV__) {
  //     this.game.debug.spriteInfo(this.mushroom, 32, 32)
  //   }
  // }
}
