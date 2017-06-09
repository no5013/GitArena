var MainState = {
	preload: function() {
		game.load.image('sky', '../images/sky.png')
		game.load.image('ground', '../images/platform.png')
		game.load.image('star', '../images/star.png')
		game.load.spritesheet('dude', '../images/dude.png', 32, 48);

	},

	create: function() {
		game.physics.startSystem(Phaser.Physics.ARCADE)

		game.add.sprite(0,0, 'sky')

		platforms = game.add.group()

		platforms.enableBody = true;

		var ground = platforms.create(0, game.world.height - 64, 'ground');

		ground.scale.setTo(2, 2)

		ground.body.immovable = true;

		var ledge = platforms.create(400, 400, 'ground')

		ledge.body.immovable = true

		ledge = platforms.create(-150, 250, 'ground')

		ledge.body.immovable = true;



		player = game.add.sprite(32, game.world.height - 150, 'dude')

		game.physics.arcade.enable(player)

		player.body.bounce.y = 0.2
		// player.body.gravity.y = 300
		player.body.collideWorldBounds = true;

		player.animations.add('left', [0, 1, 2, 3], 10, true)
		player.animations.add('right', [5, 6, 7, 8], 10, true)

		//Control
		cursors = game.input.keyboard.createCursorKeys()

		stars = game.add.group()

		stars.enableBody = true

		for (var i=0; i<12; i++){
			var star = stars.create(i*70, 0, 'star')

			star.body.gravity.y = 100

			star.body.bounce.y = 0.7 + Math.random() * 0.2
		}

		//score ui
		scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
		button = game.add.button(game.world.centerX, game.world.centerY, 'button', function() {
			window.location.href = "https://github.com/login/oauth/authorize?client_id=3542efee6daf562d4b08&scope=user:email%20public_repo"
		}, this)
	},

	update: function() {

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

		// if(cursors.up.isDown && player.body.touching.down && hitPlatform){
		// 	player.body.velocity.y = -350;
		// }
		function collectStar (player, star) {
			star.kill()

			score += 10;
			scoreText.text = 'Score:' + score;
		}

	}


}

module.exports = new MainState();
