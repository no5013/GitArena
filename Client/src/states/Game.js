/* globals __DEV__ */
import Phaser from 'phaser'
import Util from '../util/Util'
import RepoHero from '../prefabs/units/RepoHero'
import PlayerUnit from '../prefabs/units/PlayerUnit'
import EnemyUnit from '../prefabs/units/EnemyUnit'

import TextPrefab from '../prefabs/TextPrefab'

import UnitSelectState from '../StateMachine/ActionState/UnitSelectState'
import WalkState from '../StateMachine/ActionState/WalkState'
import TargetSelectionState from '../StateMachine/ActionState/TargetSelectionState'
import ActionSelectState from '../StateMachine/ActionState/ActionSelectState'
import EndTurnState from '../StateMachine/ActionState/EndTurnState'
import WalkedState from '../StateMachine/ActionState/WalkedState'
import EnemyActionState from '../StateMachine/ActionState/EnemyActionState'
import SkillSelectionState from '../StateMachine/ActionState/SkillSelectionState'

import Menu from '../prefabs/huds/Menu'
import DamageText from '../prefabs/huds/DamageText'

import AttackMenuItem from '../prefabs/huds/AttackMenuItem'
import SkillMenuItem from '../prefabs/huds/SkillMenuItem'
import WalkMenuItem from '../prefabs/huds/WalkMenuItem'
import EndTurnMenuItem from '../prefabs/huds/EndTurnMenuItem'
import SkillSelectionMenuItem from '../prefabs/huds/SkillSelectionMenuItem'

import PriorityQueue from '../Structure/PriorityQueue'

const tile_size_x = 32
const tile_size_y = 32

var cursors
var camera_speed = 5;
var marker;
var moving = {}

var animation_mapping = {
  "spritesheet_name": "vx_chara01",
  "sprite": {
    "hero1": {
      "idle": {
        "animations_sequence": [0,1,2.1],
        "loop": true
      },
      "down": {
        "animations_sequence": [0,1,2,1],
        "loop": true
      },
      "left": {
        "animations_sequence": [12,13,14,13],
        "loop": true
      },
      "right": {
        "animations_sequence": [24,25,26,25],
        "loop": true
      },
      "up": {
        "animations_sequence": [36,37,38,37],
        "loop": true
      }
    }
  }
}

const move_speed = 0.01

export default class extends Phaser.State {

  init (battle_data, level_data, extra_parameters) {
    let self = this;
    this.ActionState = {
      UnitSelectState: new UnitSelectState(self),
      WalkState: new WalkState(self),
      TargetSelectionState: new TargetSelectionState(self),
      ActionSelectState: new ActionSelectState(self),
      EndTurnState: new EndTurnState(self),
      WalkedState: new WalkedState(self),
      EnemyActionState: new EnemyActionState(self),
      SkillSelectionState: new SkillSelectionState(self)
    }
    this.properties = {
      ActionStateVar: {}
    }

    this.groups = {
      hud: this.game.add.group(),
      player_units: this.game.add.group(),
      enemy_units: this.game.add.group()
    }
    this.prefabs = {}
    this.used_commands = {}

    this.units = new PriorityQueue({
      comparator: function(unit_a, unit_b){
        return unit_a.act_turn - unit_b.act_turn
      }
    })

    this.battle_data = battle_data
    this.level_data = level_data
    this.extra_parameters = extra_parameters
    this.player_units = this.extra_parameters.player_units
  }

  create () {
    var self = this

    this.initMapJSON()
    this.initRangeMap()

    this.initMarker()

    this.initUnits()

    game.physics.startSystem(Phaser.Physics.ARCADE);

    cursors = game.input.keyboard.createCursorKeys();

    this.TEXT_STYLE = {font: "30px Arial", fill: "#FFFFFF"}
    this.HUD_TEXT_STYLE = {font: "16px Arial", fill: "#FFFFFF"}
    // this.init_player_actions({x:400, y:100});

    this.initSkillMenu({x:400, y:100})
    this.initActionMenu({x:400, y:100})
    this.disableActionCommandHud();
    this.disableUnitSkillCommandHud();

    game.world.bringToTop(this.groups.hud);
    game.world.bringToTop(this.groups.player_units);
    game.world.bringToTop(this.groups.enemy_units);

    this.next_turn();
    this.setActionState(this.ActionState.UnitSelectState)
  }

  enableActionCommandHud(){
    this.setActionMenu(this.current_unit)
    this.prefabs['actions_menu'].enable();
    this.prefabs['actions_menu'].show();
  }

  disableActionCommandHud(){
    this.prefabs['actions_menu'].disable();
    this.prefabs['actions_menu'].hide();
  }

  enableUnitSkillCommandHud(){
    this.prefabs['skills_menu'].enable();
    this.prefabs['skills_menu'].show();
  }

  disableUnitSkillCommandHud(){
    this.prefabs['skills_menu'].disable();
    this.prefabs['skills_menu'].hide();
  }

  findObjectsByType(type, map, layer) {
    var result = new Array();
    map.objects[layer].forEach(function(element){
      if(element.properties.type === type) {
        //Phaser uses top left, Tiled bottom left so we have to adjust
        //also keep in mind that the cup images are a bit smaller than the tile which is 16x16
        //so they might not be placed in the exact position as in Tiled
        element.y -= map.tileHeight;
        result.push(element);
      }
    });
    return result;
  }

  update () {
    if (cursors.left.isDown)
    {
      game.camera.x-=camera_speed;
    }
    else if (cursors.right.isDown)
    {
      game.camera.x+=camera_speed;
    }
    else if (cursors.up.isDown)
    {
      game.camera.y-=camera_speed;
    }
    else if (cursors.down.isDown)
    {
      game.camera.y+=camera_speed;
    }
  }

  moveUnit(unit, to_tile_x, to_tile_y, callback) {
    var from_tile_x = this.layer.getTileX(unit.x);
    var from_tile_y = this.layer.getTileY(unit.y);
    let from_tile = this.map.getTile(from_tile_x, from_tile_y, this.layer)

    let to_tile = this.map.getTile(to_tile_x, to_tile_y, this.layer)

    game.camera.follow(unit)
    unit.moveTo(to_tile_x*tile_size_x, to_tile_y*tile_size_y, callback)
    from_tile.properties['owner'] = null
    to_tile.properties['owner'] = unit
  }

  finishAction() {
    game.camera.follow(null)
    let self = game.state.states.Game
    self.currentState.nextState();
  }

  getTileProperties() {
    var x = this.layer.getTileX(game.input.activePointer.worldX);
    var y = this.layer.getTileY(game.input.activePointer.worldY);

    this.currentState.selectTile(x, y)
  }

  showMovingRange(unit){
    let self = this
    var tileToPush = this.getMovingRangeCoordinate(unit);
    tileToPush.forEach(function(coordinate){
      self.rangeMap.putTile(new Phaser.Tile(self.rangeLayer,34,0,0,tile_size_x,tile_size_y),coordinate.x, coordinate.y, self.rangeLayer)
    })
  }

  showAttackRange(unit){
    let self = this
    var tileToPush = this.getAttackRangeCoordinate(unit.x/tile_size_x, unit.y/tile_size_y, unit.attackRange);
    tileToPush.forEach(function(coordinate){
      self.rangeMap.putTile(new Phaser.Tile(self.rangeLayer,104,0,0,tile_size_x,tile_size_y),coordinate.x, coordinate.y, self.rangeLayer)
    })
  }

  removeMovingRange(unit){
    let self = this
    var tileToPush = this.getMovingRangeCoordinate(unit);
    tileToPush.forEach(function(coordinate){
      self.rangeMap.removeTile(coordinate.x, coordinate.y, self.rangeLayer)
    })
  }

  removeAttackRange(unit){
    let self = this
    var tileToPush = this.getAttackRangeCoordinate(unit.x/tile_size_x, unit.y/tile_size_y, unit.attackRange);
    tileToPush.forEach(function(coordinate){
      self.rangeMap.removeTile(coordinate.x, coordinate.y, self.rangeLayer)
    })
  }

  getMovingRangeCoordinate(unit){
    let x = unit.x/tile_size_x
    let y = unit.y/tile_size_y

    var possibleMove = []

    for(let j=0; j<=unit.movingRange; j++){
      for(let i=0; i<=unit.movingRange-j; i++){
        possibleMove.push(
          {
            x:x+i,
            y:y+j
          },
          {
            x:x+i,
            y:y-j
          },
          {
            x:x-i,
            y:y+j
          },
          {
            x:x-i,
            y:y-j
          }
        )
      }
    }

    return possibleMove
  }

  getAttackRangeCoordinate(current_x, current_y, attack_range){
    let x = current_x
    let y = current_y

    var possibleAttack = []

    for(let j=0; j<=attack_range; j++){
      for(let i=0; i<=attack_range-j; i++){
        if(i==0 && j==0)
        continue;
        possibleAttack.push(
          {
            x:x+i,
            y:y+j
          },
          {
            x:x+i,
            y:y-j
          },
          {
            x:x-i,
            y:y+j
          },
          {
            x:x-i,
            y:y-j
          }
        )
      }
    }

    return possibleAttack
  }

  updateMarker() {
    marker.x = this.layer.getTileX(game.input.activePointer.worldX) * tile_size_x;
    marker.y = this.layer.getTileY(game.input.activePointer.worldY) * tile_size_y;
  }

  initMarker() {
    // mouse input
    marker = game.add.graphics();
    marker.lineStyle(2, 0xffffff, 1);
    marker.drawRect(0, 0, tile_size_x, tile_size_y);
    game.input.addMoveCallback(this.updateMarker, this);
    game.input.onDown.add(this.getTileProperties, this);
  }

  initMapJSON() {
    this.map = this.game.add.tilemap(this.level_data.map.key);
    let tileset_index = 0;
    this.map.tilesets.forEach(function (tileset) {
      this.map.addTilesetImage(tileset.name, this.level_data.map.tilesets[tileset_index++]);
    }, this);

    //create layer
    this.layer = this.map.createLayer('PlayFieldLayer')
    this.colliderlayer = this.map.createLayer('ColliderLayer')
    // this.rangeLayer = this.map.createLayer('RangeLayer')

    this.layer.resizeWorld()
  }

  initRangeMap() {
    this.rangeMap = game.add.tilemap(null, tile_size_x, tile_size_y);
    this.rangeMap.addTilesetImage('tiles');
    this.rangeLayer = this.rangeMap.createBlankLayer("RangeLayer", this.map.width, this.map.height, tile_size_x, tile_size_y)
    this.rangeLayer.resizeWorld()
    this.rangeLayer.alpha = 0.5
  }

  initUnits() {
    let self = this
    let runner = 0

    var player_unit_spawn_points = this.findObjectsByType("player_unit", this.map, "ObjectLayer")
    var enemy_unit_spawn_points = this.findObjectsByType("enemy_unit", this.map, "ObjectLayer")

    this.player_units.forEach(function(player_unit){
      var player = new PlayerUnit({
        game: this,
        x: player_unit_spawn_points[runner].x,
        y: player_unit_spawn_points[runner].y,
        asset: 'chara',
        name: player_unit.name,
        health: 10,
        num: runner,
        properties: {
          group: "player_units",
          animation_mapping: animation_mapping.sprite.hero1
        }
      })

      let tile = self.map.getTile(player_unit_spawn_points[runner].x/32, player_unit_spawn_points[runner++].y/32)
      tile.properties['owner'] = player

      player.calculateActTurn(0)
      this.units.queue(player)
    }, this)

    let new_runner = 0
    this.level_data.enemy_encounters.forEach(function(enemy){
      var enemy = new EnemyUnit({
        game: this,
        x: enemy_unit_spawn_points[new_runner].x,
        y: enemy_unit_spawn_points[new_runner].y,
        asset: 'chara',
        name: enemy.name,
        health: 10,
        num: runner,
        properties: {
          group: "enemy_units",
          animation_mapping: animation_mapping.sprite.hero1
        }
      })

      let tile = self.map.getTile(enemy_unit_spawn_points[new_runner].x/32, enemy_unit_spawn_points[new_runner++].y/32)
      tile.properties['owner'] = enemy

      enemy.calculateActTurn(0)
      this.units.queue(enemy)
    }, this)
  }

  next_turn() {
    this.clearTurn();

    if(this.groups.player_units.countLiving()<=0){
      this.endBattle()
    }

    if(this.groups.enemy_units.countLiving()<=0){
      this.endBattle()
    }

    this.current_unit = this.units.dequeue();
    console.log("HEALTH: " + this.current_unit.health)
    this.setSkillMenu()
    this.setActionMenu()
    this.resetTurn()

    if(this.current_unit.alive){
      this.current_unit.setActive()
      this.current_unit.calculateActTurn(this.current_unit.act_turn)
      this.units.queue(this.current_unit)
    }
    else{
      this.next_turn();
    }
  }

  clearTurn () {
    this.properties.ActionStateVar = {}
  }

  setActionState(state) {
    if(this.currentState){
      this.currentState.leaveState();
    }
    this.currentState = state;
    this.currentState.enterState();
  }

  initActionMenu(position) {
    this.actions_menu = new Menu(this, "actions_menu", position, {group: "hud", menu_items: []})
  }

  getAvailableAction(unit) {
    let self = this

    var available_actions = []
    unit.actions.forEach(function(action){
      if(!self.used_commands[action.text]){
        available_actions.push(action)
      }
    })
    return available_actions
  }

  setActionMenu () {
    var self = this
    var unit = this.current_unit

    var actions, actions_menu_items, action_index, actions_menu

    // Available Action
    actions = this.getAvailableAction(unit)

    actions_menu_items = []
    action_index = 0;

    // Create a menu item for each action
    actions.forEach(function (action) {
      actions_menu_items.push(new action.item_constructor(this, action.text+"_menu_item", {x: 400, y:100 + action_index * 35}, {group: "hud", text: action.text, style: Object.create(self.TEXT_STYLE)}));
      action_index++;
    }, this);
    this.actions_menu.menu_items = actions_menu_items
    this.disableActionCommandHud()
  }

  initSkillMenu (position) {
    this.skills_menu = new Menu(this, "skills_menu", position, {group: "hud", menu_items: []})
  }

  resetTurn(){
    this.used_commands = {}
  }

  setSkillMenu(){
    var self = this
    var unit = this.current_unit

    var actions, actions_menu_items, action_index, actions_menu

    // Available Action
    actions = unit.skills

    actions_menu_items = []
    action_index = 0;

    // Create a menu item for each action
    actions.forEach(function (action) {
      actions_menu_items.push(new SkillSelectionMenuItem(this, action.name+"_menu_item", {x: 400, y: 100 + action_index * 35}, {
        skill: action,
        group: "hud",
        text: action.name,
        style: Object.create(self.TEXT_STYLE)
      }));
      action_index++;
    }, this);
    this.skills_menu.menu_items = actions_menu_items
    this.disableUnitSkillCommandHud()
  }


  endBattle(){
    this.state.start('MainMenu', true, false)
  }

  gameOver(){

  }

  render () {

  }
}
