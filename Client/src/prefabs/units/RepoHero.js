import Phaser from 'phaser'
import Util from '../../util/Util'

const move_speed = 0.25;

export default class extends Phaser.Sprite {

  constructor ({ game, x, y, asset, name, health, num}) {
    super(game.game, x, y, asset)

    let self = this;

    this.game = game;
    this.name = name;
    this.health = health;
    this.num = num;
    this.properties = {};
    this.state = game
    this.movingRange = 5
    this.attackRange = 3

    this.anchor.setTo(0,0.5)
    // this.game.add.existing(this);
    game.physics.arcade.enable(this)

    this.body.collideWorldBounds = true;

    this.initAnimations();
    this.setDeactive();
    this.initDamageText();
    this.initNameTag();

    this.attacked_animation = this.game.add.tween(this);
    this.attacked_animation.to({tint: 0xFF0000}, 200);
    this.attacked_animation.onComplete.add(function(){
      self.restoreTint();
    }, this)
  }

  initNameTag(){
    this.textname = this.game.make.text(0, 40, this.name);
    this.textname.fill = '#FFFFFF'
    this.textname.align = 'center'
    this.textname.font = '10px Barrio'
    this.textname.stroke = '#000000';
    this.textname.strokeThickness = 2;
    this.textname.anchor.setTo(0.5,0.5)
    this.addChild(this.textname);
  }

  initDamageText(){
    this.damage_text = this.game.make.text(0, -40, "");
    this.damage_text.fill = '#FF0000'
    this.damage_text.align = 'center'
    this.damage_text.stroke = '#000000';
    this.damage_text.strokeThickness = 5;
    this.damage_text.anchor.setTo(0.25,0.5)
    this.addChild(this.damage_text);
  }

  log() {
    console.log("repo hero")
  }

  update () {

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

  moveTo (dest_x, dest_y, callback){
    let distance = Util.distanceBetweenPoint(this.x,this.y, dest_x, dest_y)
    let direction = Util.directionOfVector(this.x, this.y, dest_x, dest_y)
    console.log(direction)

    if(this.isMoving){
      return false;
    }
    this.isMoving = true;
    this.animations.play(direction)

    var characterMovement = game.add.tween(this);
    characterMovement.to({x: dest_x, y: dest_y}, distance/move_speed);
    characterMovement.onComplete.add(function(){
      this.isMoving = false
      callback()
    }, this)
    characterMovement.start();
  }

  takeDamage (damage){
    console.log(this.x + " " + this.y)
    this.health-=damage

    this.tint = 0xff0000;
    console.log(`Receive ${damage}, remaining ${this.health}`)

    this.damage_text.text = damage
    var damage_float = game.add.tween(this.damage_text);
    damage_float.to({x: 0, y: -60}, 1000);
    damage_float.onComplete.add(function(){
      this.damage_text.text = ""
      this.damage_text.x = 0
      this.damage_text.y = -40
    }, this)
    damage_float.start();

    this.attacked_animation.start();

    if(this.health <= 0){
      this.die()
    }
    else{
      this.addQuake()
    }
  }

  restoreTint () {
    if(this.properties['active']){
      this.tint = 0xFFFFFF;
    }
    else {
      this.tint = 0xa0a0a0;
    }
  }

  die () {
    this.kill();
  }

  attack (player) {
    player.takeDamage(2)
    this.setDeactive();
  }

  selected () {
    // this.animations.play('idle')
  }

  unselected () {
    // this.animations.stop()
    // this.frame = 1+this.num*3
  }

  setDeactive () {
    this.animations.stop()
    this.frame = 1+this.num*3
    this.properties['active'] = false
    this.restoreTint();

  }

  setActive () {
    this.animations.play('idle')
    this.properties['active'] = true
    this.restoreTint();
  }

  addQuake () {
    // define the camera offset for the quake
    var rumbleOffset = 10;

    // we need to move according to the camera's current position
    var properties = {
      x: this.x - rumbleOffset
    };

    // we make it a relly fast movement
    var duration = 100;
    // because it will repeat
    var repeat = 1;
    // we use bounce in-out to soften it a little bit
    var ease = Phaser.Easing.Bounce.InOut;
    var autoStart = false;
    // a little delay because we will run it indefinitely
    var delay = 0;
    // we want to go back to the original position
    var yoyo = true;

    var quake = game.add.tween(this)
    .to(properties, duration, ease, autoStart, delay, repeat, yoyo);

    // let the earthquake begins
    quake.start();
  }

  initAnimations(){
    this.animations.add('down', [0+this.num*3, 1+this.num*3, 2+this.num*3, 1+this.num*3], 5, true)
    this.animations.add('left', [12+this.num*3, 13+this.num*3, 14+this.num*3, 13+this.num*3], 5, true)
    this.animations.add('right', [24+this.num*3, 25+this.num*3, 26+this.num*3, 25+this.num*3], 5, true)
    this.animations.add('up', [36+this.num*3, 37+this.num*3, 38+this.num*3, 37+this.num*3], 5, true)
    this.animations.add('idle', [0+this.num*3, 1+this.num*3, 2+this.num*3, 1+this.num*3], 5, true)
  }
}
