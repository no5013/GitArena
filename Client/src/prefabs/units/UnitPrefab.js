import Phaser from 'phaser'
import ActionMessage from '../huds/ActionMessage'
import Util from '../../util/Util'
import DamageText from '../huds/DamageText'
import Effect from '../huds/Effect'

import AttackMenuItem from '../huds/AttackMenuItem'
import SkillMenuItem from '../huds/SkillMenuItem'
import WalkMenuItem from '../huds/WalkMenuItem'
import EndTurnMenuItem from '../huds/EndTurnMenuItem'

import Prefab from '../Prefab'

// import {Skills} from '../../GameData/SkillData'

const move_speed = 0.25;

export default class extends Prefab {

  constructor (game_state, name, position, properties) {
    super(game_state, name, position, properties)

    this.animation_mapping = properties.animation_mapping
    this.unit = properties.unit

    this.name = name;
    this.health = this.unit.stats.health;
    this.status = {};
    this.state = game


    this.movingRange = 10
    this.attackRange = this.unit.stats.attack_range
    this.move_speed = 0.25
    this.speed = 20;
    this.act_turn = 0;
    this.direction = "down"

    this.skills = []

    this.actions = [
      {text: "Move", item_constructor: WalkMenuItem.prototype.constructor},
      {text: "Attack", item_constructor: AttackMenuItem.prototype.constructor},
      {text: "Skill", item_constructor: SkillMenuItem.prototype.constructor},
      {text: "Endturn", item_constructor: EndTurnMenuItem.prototype.constructor}
    ]

    this.anchor.setTo(0,0.5)

    this.initAnimations();
    this.initNameTag();
    this.initInitialSkill();

    this.animations.play("down")
    this.setDeactive();
  }

  initInitialSkill(){
    if(this.unit.job!=null){
      console.log("HEROOOOOOOOOOOOOOOOOOOOOOOOOO")
      console.log(this.unit.job)
      this.skills = this.unit.job.skills
    }
    // var super_attack = Skills['super_hit']
    // var heal = Skills['heal']
    // this.skills.push(heal)
    // this.skills.push(super_attack)

  }

  initNameTag(){
    this.textname = this.game_state.make.text(0, 40, this.name);
    this.textname.fill = '#FFFFFF'
    this.textname.align = 'center'
    this.textname.font = '10px Barrio'
    this.textname.stroke = '#000000';
    this.textname.strokeThickness = 2;
    this.textname.anchor.setTo(0.5,0.5)
    this.addChild(this.textname);
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

    var characterMovement = this.game_state.add.tween(this).to({x: dest_x, y: dest_y}, distance/move_speed);
    characterMovement.onComplete.add(function(){
      this.isMoving = false
      callback()
    }, this)
    characterMovement.start();
  }

  faceTo (dest_x, dest_y){
    var direction = Util.directionOfVector(this.x, this.y, dest_x, dest_y)
    if(this.direction != direction){
      this.direction = direction
      this.animations.stop()
      this.animations.play(this.direction)
    }
  }

  getAttackRangeCoordinate(){
    var possibleAttack = []

    for(let j=0; j<=this.attackRange; j++){
      for(let i=0; i<=this.attackRange-j; i++){
        if(i==0 && j==0)
        continue;
        possibleAttack.push(
          {
            x:+i,
            y:+j
          },
          {
            x:+i,
            y:-j
          },
          {
            x:-i,
            y:+j
          },
          {
            x:-i,
            y:-j
          }
        )
      }
    }
    return possibleAttack
  }

  takeDamage (damage){
    this.health-=damage
    console.log(`Receive ${damage}, remaining ${this.health}`)

    var damage_text = new DamageText(this.game_state, "damage_text", {x:this.x, y:this.y}, {
      group: "effect",
      text: damage,
      style: Object.create(this.game_state.HUD_TEXT_STYLE),
      distance: 30,
      duration: 500,
    })
    damage_text.anchor.setTo(0.25,0.5)

    this.attacked_animation.start();

    if(this.health <= 0){
      this.die()
    }
    else{

      // BUG when 2 tween run at the same time
      this.addQuake()
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
    this.game_state.removeUnitFromGame(this)
    this.kill();
  }

  attack (target) {
    target.takeDamage(2)
    var effect = new Effect(this.game_state, "effect", {x:target.x, y:target.y}, {
      group: "effect",
      texture: "slash"
    })
    effect.anchor.setTo(0.25,0.5)
  }

  useSkill(skill, target){
    skill.use(target)
    if(skill.sprite_name != null){
      var effect = new Effect(this.game_state, "effect", {x:target.x, y:target.y}, {
        group: "effect",
        texture: skill.sprite_name
      })
      effect.anchor.setTo(0.25,0.5)
    }
  }

  selected () {

  }

  unselected () {

  }

  equals(other){
    if(this === other){
      return true
    }
    return false
  }

  setDeactive () {
    this.animations.stop()
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

    var quake = this.game_state.add.tween(this)
    .to(properties, duration, ease, autoStart, delay, repeat, yoyo);

    // let the earthquake begins
    quake.start();
  }

  initAnimations(){

    for (let animation_name in this.animation_mapping) { // load assets according to asset key
      if (this.animation_mapping.hasOwnProperty(animation_name)){
        this.animations.add(animation_name, this.animation_mapping[animation_name].animations_sequence, 5, true)
      }
    }

    //attacked_animation
    this.attacked_animation = this.game_state.add.tween(this);
    this.attacked_animation.to({tint: 0xFF0000}, 200);
    this.attacked_animation.onComplete.add(function(){
      this.restoreTint();
    }, this)

    //healed_animation
    this.healed_animation = this.game_state.add.tween(this);
    this.healed_animation.to({tint: 0x00FFFF}, 200);
    this.healed_animation.onComplete.add(function(){
      this.restoreTint();
    }, this)
  }
}
