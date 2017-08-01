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
import ResultState from '../StateMachine/ActionState/ResultState'
import RewardState from '../StateMachine/ActionState/RewardState'

import Menu from '../prefabs/huds/Menu'
import UnitQueue from '../prefabs/huds/UnitQueue'
import PlayerStatus from '../prefabs/huds/PlayerStatus'
import DamageText from '../prefabs/huds/DamageText'

import AttackMenuItem from '../prefabs/huds/AttackMenuItem'
import SkillMenuItem from '../prefabs/huds/SkillMenuItem'
import WalkMenuItem from '../prefabs/huds/WalkMenuItem'
import EndTurnMenuItem from '../prefabs/huds/EndTurnMenuItem'
import SkillSelectionMenuItem from '../prefabs/huds/SkillSelectionMenuItem'
import UnitMenuItem from '../prefabs/huds/UnitMenuItem'

import PriorityQueue from '../Structure/PriorityQueue'

import { centerGameObjects } from '../utils'

const tile_size_x = 32
const tile_size_y = 32

var cursors
var camera_speed = 5;
var marker;
var moving = {}

const move_speed = 0.01

export default class extends Phaser.State {

  init (battle_data, extra_parameters) {
    let self = this;
    this.ActionState = {
      UnitSelectState: new UnitSelectState(self),
      WalkState: new WalkState(self),
      TargetSelectionState: new TargetSelectionState(self),
      ActionSelectState: new ActionSelectState(self),
      EndTurnState: new EndTurnState(self),
      WalkedState: new WalkedState(self),
      EnemyActionState: new EnemyActionState(self),
      SkillSelectionState: new SkillSelectionState(self),
      RewardState: new RewardState(self),
      ResultState: new ResultState(self)
    }
    this.properties = {
      ActionStateVar: {}
    }

    this.groups = {
      hud: this.game.add.group(),
      player_units: this.game.add.group(),
      enemy_units: this.game.add.group(),
      effect: this.game.add.group()
    }
    this.prefabs = {}
    this.used_commands = {}

    this.units = new PriorityQueue({
      comparator: function(unit_a, unit_b){
        return unit_a.act_turn - unit_b.act_turn
      }
    })

    this.battle_data = battle_data
    this.extra_parameters = extra_parameters
    this.player_units = this.extra_parameters.player_units
    this.level = this.extra_parameters.level
  }

  preload () {
    var file_text = this.game.cache.getText("units_file");
    var file_data = JSON.parse(file_text);
    this.extra_parameters.units = file_data

    var enemy_unit_keys = Object.keys(this.extra_parameters.units.enemies)
    enemy_unit_keys.forEach(function(enemy_key){
      var enemy_file = this.extra_parameters.units.enemies[enemy_key]
      this.load.spritesheet(enemy_file.name, enemy_file.asset.spritesheet_source, enemy_file.asset.frame_width, enemy_file.asset.frame_height, enemy_file.asset.frames, enemy_file.asset.margin, enemy_file.asset.spacing)
      this.load.text(enemy_file.name + "_mapper", enemy_file.asset.spritesheet_mapper_source)
    }, this)

    var player_unit_keys = Object.keys(this.extra_parameters.units.players)
    player_unit_keys.forEach(function(player_key){
      var player_file = this.extra_parameters.units.players[player_key]
      this.load.spritesheet(player_file.name, player_file.asset.spritesheet_source, player_file.asset.frame_width, player_file.asset.frame_height, player_file.asset.frames, player_file.asset.margin, player_file.asset.spacing)
      this.load.text(player_file.name + "_mapper", player_file.asset.spritesheet_mapper_source)
    }, this)
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
    this.RESULT_TEXT_STYLE = {font: "40px Arial", fill: "#000000"}
    // this.init_player_actions({x:400, y:100});

    this.initSkillMenu({x:400, y:100})
    this.initActionMenu({x:400, y:100})
    this.initPlayerStatusHud({x:600, y:0})
    this.initUnitQueue({x:0,y:0})
    this.disableActionCommandHud();
    this.disableUnitSkillCommandHud();

    game.world.bringToTop(this.groups.hud);
    game.world.bringToTop(this.groups.player_units);
    game.world.bringToTop(this.groups.enemy_units);
    game.world.bringToTop(this.groups.effect);

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

  showResult(){
    var result_text = new TextPrefab(this, "result_text", {x: 400, y: 200}, {
      text: "WIN",
      style: Object.create(this.RESULT_TEXT_STYLE),
      group: "hud"
    })
  }

  showReward(){
    var reward_text = new TextPrefab(this, "reward_text", {x: 400, y: 200}, {
      text: "REWARD",
      style: Object.create(this.RESULT_TEXT_STYLE),
      group: "hud"
    })

    var exp_reward_text = new TextPrefab(this, "exp_reward_text", {x: 400, y: 300}, {
      text: `EXP: ${this.level.reward.experience}` ,
      style: Object.create(this.TEXT_STYLE),
      group: "hud"
    })

    var money_reward_text = new TextPrefab(this, "money_reward_text", {x: 400, y: 350}, {
      text: `MONEY: ${this.level.reward.money}` ,
      style: Object.create(this.TEXT_STYLE),
      group: "hud"
    })
  }

  initPlayerStatusHud(position){
    this.player_status = new PlayerStatus(this, "player_status", position, {group: "hud"})
  }

  initUnitQueue(position){
    this.unit_queue = new UnitQueue(this, "unit_queue", position, {group: "hud", menu_items: []})
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

  removeUnitFromGame(unit){
    var tile_x = this.layer.getTileX(unit.x);
    var tile_y = this.layer.getTileY(unit.y);
    let tile = this.map.getTile(tile_x, tile_y, this.layer)
    tile.properties['owner'] = null
    this.units.removeObjectFromQueue(unit)
    this.setUnitQueue()
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

  showAttackRange(unit, skill){
    let self = this
    var tileToPush = unit.getAttackRangeCoordinate()
    if(skill!=null){
      // var tileToPush = unit.getAttackRangeCoordinate()
      var tileToPush = skill.getSkillRangeCoordinate(unit.direction)
    }
    tileToPush.forEach(function(coordinate){
      self.rangeMap.putTile(new Phaser.Tile(self.rangeLayer,104,0,0,tile_size_x,tile_size_y),(unit.x/tile_size_x)+coordinate.x, (unit.y/tile_size_y)+coordinate.y, self.rangeLayer)
    })
  }

  removeRange(){
    for(let i=0; i<this.rangeMap.tileWidth; i++){
      for(let j=0; j<this.rangeMap.tileHeight; j++){
        this.rangeMap.removeTile(i, j, this.rangeLayer)
      }
    }
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
    this.map = this.game.add.tilemap(this.level.map.key);
    let tileset_index = 0;
    this.map.tilesets.forEach(function (tileset) {
      this.map.addTilesetImage(tileset.name, this.level.map.tilesets[tileset_index++]);
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
      console.log(player_unit)
      var player = new PlayerUnit(this, player_unit.name, player_unit_spawn_points[runner],
        {
          group: "player_units",
          texture: 'chara',
          unit: player_unit,
          animation_mapping: JSON.parse(this.game.cache.getText(player_unit.sprite_name + "_mapper")).sprite[player_unit.sprite_name]
        }
      )

      let tile = self.map.getTile(player_unit_spawn_points[runner].x/32, player_unit_spawn_points[runner++].y/32)
      tile.properties['owner'] = player

      player.calculateActTurn(0)
      this.units.queue(player)
    }, this)

    let new_runner = 0
    this.level.enemy_encounters.forEach(function(enemy_unit){
      var enemy = new EnemyUnit(this, enemy_unit.name, enemy_unit_spawn_points[new_runner],
        {
          group: "enemy_units",
          texture: enemy_unit.sprite_name,
          unit: enemy_unit,
          animation_mapping: JSON.parse(this.game.cache.getText(enemy_unit.sprite_name + "_mapper")).sprite[enemy_unit.sprite_name]
        }
      )

      let tile = self.map.getTile(enemy_unit_spawn_points[new_runner].x/32, enemy_unit_spawn_points[new_runner++].y/32)
      tile.properties['owner'] = enemy

      enemy.calculateActTurn(0)
      this.units.queue(enemy)
    }, this)
  }

  setPlayerStatusHud(){
    this.player_status.setPlayer(this.current_unit)
  }

  next_turn() {
    this.clearTurn();
    this.setUnitQueue()

    this.current_unit = this.units.dequeue();
    console.log("HEALTH: " + this.current_unit.health)
    this.setSkillMenu()
    this.setActionMenu()
    this.setPlayerStatusHud()
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
    if(unit.skills == null){
      return;
    }

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

  setUnitQueue(){
    var self = this

    var actions, actions_menu_items, action_index, actions_menu

    // Available Action
    actions = this.units.priority_queue

    actions_menu_items = []
    action_index = 0;

    // Create a menu item for each action
    actions.forEach(function (action) {
      actions_menu_items.push(new UnitMenuItem(this, action.name+"_queue_item", {x: 0, y: 0 + action_index * 35}, {
        group: "hud",
        text: action.name,
        style: Object.create(self.TEXT_STYLE)
      }));
      action_index++;
    }, this);
    this.unit_queue.updateQueue(actions_menu_items)
  }


  endBattle(){
    this.state.start('Boot', true, false, "assets/levels/level.json", "MainMenu")
  }

  gameOver(){

  }

  render () {

  }
}
