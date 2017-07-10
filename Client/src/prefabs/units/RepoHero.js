import Phaser from 'phaser'
import ActionMessage from '../huds/ActionMessage'
import Util from '../../util/Util'
import DamageText from '../huds/DamageText'
import Skill from '../skills/Skill'
import Heal from '../skills/Heal'

import AttackMenuItem from '../huds/AttackMenuItem'
import SkillMenuItem from '../huds/SkillMenuItem'
import WalkMenuItem from '../huds/WalkMenuItem'
import EndTurnMenuItem from '../huds/EndTurnMenuItem'

const move_speed = 0.25;

export default class RepoHero extends Phaser.Sprite {

  constructor ({game, x, y, asset, name, health, num, properties}) {
    super(game.game, x, y, asset)
    this.game.add.existing(this)

    game.prefabs[name] = this
    game.groups[properties.group].add(this);

    this.animation_mapping = properties.animation_mapping
    console.log(this.animation_mapping)

    let self = this;

    this.game = game;
    this.name = name;
    this.health = health;
    this.num = num;
    this.status = {};
    this.state = game
    this.movingRange = 10
    this.attackRange = 3
    this.move_speed = 0.25
    this.speed = 20;
    this.act_turn = 0;

    this.skills = []

    this.actions = [
      {text: "Move", item_constructor: WalkMenuItem.prototype.constructor},
      {text: "Attack", item_constructor: AttackMenuItem.prototype.constructor},
      {text: "Skill", item_constructor: SkillMenuItem.prototype.constructor},
      {text: "Endturn", item_constructor: EndTurnMenuItem.prototype.constructor}
    ]

    this.anchor.setTo(0,0.5)

    this.initAnimations();
    this.setDeactive();
    this.initDamageText();
    this.initNameTag();
    this.initInitialSkill();

    this.attacked_animation = this.game.add.tween(this);
    this.attacked_animation.to({tint: 0xFF0000}, 200);
    this.attacked_animation.onComplete.add(function(){
      self.restoreTint();
    }, this)

    this.healed_animation = this.game.add.tween(this);
    this.healed_animation.to({tint: 0x00FFFF}, 200);
    this.healed_animation.onComplete.add(function(){
      self.restoreTint();
    }, this)
  }

  initInitialSkill(){
    var super_attack = new Skill(this.game, "SUPER ATTACK!", {x:0, y:0}, {
      group: "hud"
    })
    var heal = new Heal(this.game, "Heal!", {x:0, y:0}, {
      group: "hud"
    })
    this.skills.push(heal)
    this.skills.push(super_attack)

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

  calculateActTurn (current_turn) {
    this.act_turn = current_turn + Math.ceil(100/this.speed)
  }

  moveTo (dest_x, dest_y, callback){
    let distance = Util.distanceBetweenPoint(this.x,this.y, dest_x, dest_y)
    let direction = Util.directionOfVector(this.x, this.y, dest_x, dest_y)

    if(this.isMoving){
      return false;
    }
    this.isMoving = true;
    this.animations.play(direction)

    var characterMovement = this.game.add.tween(this);
    characterMovement.to({x: dest_x, y: dest_y}, distance/move_speed);
    characterMovement.onComplete.add(function(){
      this.isMoving = false
      callback()
    }, this)
    characterMovement.start();
  }

  takeDamage (damage){
    this.health-=damage
    console.log(`Receive ${damage}, remaining ${this.health}`)

    var test_text = new DamageText(this.game, "test_text", {x:this.x, y:this.y}, {
      group: "hud",
      text: damage,
      style: Object.create(this.game.HUD_TEXT_STYLE),
      distance: 30,
      duration: 500,
    })

    this.attacked_animation.start();

    if(this.health <= 0){
      this.die()
    }
    else{

      // BUG when 2 tween run at the same time
      // this.addQuake()
    }
  }

  heal (amount) {
    this.health += amount
    this.healed_animation.start()
  }

  restoreTint () {
    if(this.status['active']){
      this.tint = 0xFFFFFF;
    }
    else {
      this.tint = 0xa0a0a0;
    }
  }

  die () {
    this.kill();
  }

  attack (target) {
    target.takeDamage(2)

    // var action_message_position = new Phaser.Point(400, this.game.world.height * 0.1)
    // var action_message_text = this.name + " attacks " + target.name + " with 2 damage"
    // var action_message = new ActionMessage(this.game, this.name + "_action_message", action_message_position, {
    //   group: 'hud',
    //   texture: 'rectangle_image',
    //   scale: {x: 1.5, y: 0.5},
    //   duration: 1,
    //   message: action_message_text
    // })
  }

  selected () {

  }

  unselected () {

  }

  setDeactive () {
    this.animations.stop()
    this.frame = 1+this.num*3
    this.status['active'] = false
    this.restoreTint();
  }

  setActive () {
    this.animations.play('idle')
    this.status['active'] = true
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

    var quake = this.game.add.tween(this)
    .to(properties, duration, ease, autoStart, delay, repeat, yoyo);

    // let the earthquake begins
    quake.start();
  }

  initAnimations(){
    // this.animations.add('down', [0+this.num*3, 1+this.num*3, 2+this.num*3, 1+this.num*3], 5, true)
    // this.animations.add('left', [12+this.num*3, 13+this.num*3, 14+this.num*3, 13+this.num*3], 5, true)
    // this.animations.add('right', [24+this.num*3, 25+this.num*3, 26+this.num*3, 25+this.num*3], 5, true)
    // this.animations.add('up', [36+this.num*3, 37+this.num*3, 38+this.num*3, 37+this.num*3], 5, true)
    // this.animations.add('idle', [0+this.num*3, 1+this.num*3, 2+this.num*3, 1+this.num*3], 5, true)

    for (let animation_name in this.animation_mapping) { // load assets according to asset key
      if (this.animation_mapping.hasOwnProperty(animation_name)){
        console.log(animation_name)
        console.log(this.animation_mapping[animation_name])
        this.animations.add(animation_name, this.animation_mapping[animation_name].animations_sequence, 5, true)
      }
    }
  }
}
