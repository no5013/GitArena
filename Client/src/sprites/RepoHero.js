import Phaser from 'phaser'

export default class extends Phaser.Sprite {

  constructor ({ game, x, y, asset, name, health, num}) {
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

    // this.animations.add('down', [0, 1, 2, 1], 5, true)
    // this.animations.add('left', [12, 13, 14, 13], 5, true)
    // this.animations.add('right', [24, 25, 26, 25], 5, true)
    // this.animations.add('top', [36, 37, 38, 37], 5, true)
    this.animations.add('down', [0+num*3, 1+num*3, 2+num*3, 1+num*3], 5, true)
    this.animations.add('left', [12+num*3, 13+num*3, 14+num*3, 13+num*3], 5, true)
    this.animations.add('right', [24+num*3, 25+num*3, 26+num*3, 25+num*3], 5, true)
    this.animations.add('top', [36+num*3, 37+num*3, 38+num*3, 37+num*3], 5, true)
    this.animations.play('down')
    this.name = name;
    this.health = health;
    this.num = num;
    this.properties = {};
    this.properties.selected = false;

    this.damage_text = this.game.make.text(0, -40, "");
    this.damage_text.fill = '#FF0000'
    this.damage_text.align = 'center'
    this.damage_text.stroke = '#000000';
    this.damage_text.strokeThickness = 5;
    this.damage_text.anchor.setTo(0.25,0.5)
    this.addChild(this.damage_text);
  }

  update () {
    // console.log(`selected ${this.properties.selected}`)
    if(this.properties.selected == true){

    }
    else {

    }
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

  takeDamage (damage){
    console.log(this.x + " " + this.y)
    this.health-=damage
    this.damage_text.text = damage
    console.log(`Receive ${damage}, remaining ${this.health}`)

    var damage_float = game.add.tween(this.damage_text);
    damage_float.to({x: 0, y: -60}, 1000);
    damage_float.onComplete.add(function(){
      this.damage_text.text = ""
      this.damage_text.x = 0
      this.damage_text.y = -40
    }, this)
    damage_float.start();
    if(this.health <= 0)
      this.die()

  }

  die () {
    this.angle = 90
    this.animations.stop()
  }

  attack (player) {
    player.takeDamage(2)
  }

  selected () {
    this.animations.play('down')
  }

  unselected () {
    this.animations.stop()
    this.frame = 1+this.num*3
  }
}
