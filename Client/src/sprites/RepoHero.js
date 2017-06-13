import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor ({ game, x, y, asset, name, cursors}) {
    super(game.game, x, y, asset)
    this.state = game
    this.anchor.setTo(0,0.5)
    // this.game.add.existing(this);
    this.textname = this.game.make.text(0, 40, name);
    this.textname.fill = '#FFFFFF'
    this.textname.align = 'center'
    this.textname.font = '10px Barrio'
    this.textname.stroke = '#000000';
    this.textname.strokeThickness = 2;
    this.textname.anchor.setTo(0.5,0.5)
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

  }

  attack (player) {
    player.textname.text = "fuck"
  }

  move (direction, range){
    if(direction == "right"){
      this.x += range*32
    }
    if(direction == "left"){
      this.x -= range*32
    }
    if(direction == "down"){
      this.y += range*32
    }
    if(direction == "up"){
      this.y -= range*32
    }
  }
}
