import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor ({ game, x, y, asset, name, cursors}) {
    super(game.game, x, y, asset)
    this.state = game
    this.anchor.setTo(0.5)
    // this.game.add.existing(this);
    this.textname = this.game.make.text(0, 40, name);
    this.textname.fill = '#FFFFFF'
    this.textname.align = 'center'
    this.textname.font = '10px Barrio'
    this.textname.stroke = '#000000';
    this.textname.strokeThickness = 2;
    this.textname.anchor.setTo(0.5)
    this.addChild(this.textname);

		game.physics.arcade.enable(this)

    this.body.collideWorldBounds = true;

		this.animations.add('down', [0, 1, 2, 1], 5, true)
		this.animations.add('left', [12, 13, 14, 13], 5, true)
		this.animations.add('right', [24, 25, 26, 25], 5, true)
		this.animations.add('top', [36, 37, 38, 37], 5, true)
    this.animations.play('down')
  }

  update () {
    this.body.velocity.x = 0
		this.body.velocity.y = 0

		if(this.state.cursors.left.isDown){
			this.body.velocity.x = -150
			this.animations.play('left')
		}
		else if (this.state.cursors.right.isDown) {
			this.body.velocity.x = 150
			this.animations.play('right')
		}
		else if (this.state.cursors.up.isDown) {
			this.body.velocity.y = -150
			this.animations.play('top')
		}
		else if (this.state.cursors.down.isDown) {
			this.body.velocity.y = 150
			this.animations.play('down')
		}
		else {
			this.animations.stop()
			this.frame = 2
		}
  }

  attack (player) {
    player.textname.text = "fuck"
  }
}
