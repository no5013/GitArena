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

const spawn_points = [
  {
    x: 5,
    y: 5
  },
  {
    x: 20,
    y: 5
  },
  {
    x: 5,
    y: 9
  },
  {
    x: 5,
    y: 11
  }
]
const move_speed = 0.01

export default class extends Phaser.State {

  init () {
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
      hud: this.game.add.group()
    }
    this.prefabs = {}
    this.players = []
    this.enemies = []
    this.used_commands = {}

    this.units = new PriorityQueue({
      comparator: function(unit_a, unit_b){
        return unit_a.act_turn - unit_b.act_turn
      }
    })
  }

  preload () {
    // I think it tile_size_xxtile_size_x
    game.load.image('tiles', '../assets/tiles/gridtiles.png')

    game.load.image('rectangle_image', '../assets/huds/rectangle.png')

    game.load.spritesheet('chara', '../assets/images/vx_chara01.png', tile_size_x, 48);

    // Load temp button
    game.load.spritesheet('button', 'assets/images/button_sprite_sheet.png', 193, 71);
  }

  log() {
    console.log("GAME LOG")
  }

  create () {
    var self = this

    this.prefabs = {}

    // this.initMap()
    this.initMapp()

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

    this.next_turn();
    this.setActionState(this.ActionState.UnitSelectState)
  }

  enableActionCommandHud(){
    console.log("USED COMMAND")
    console.log(this.used_commands)
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

  initMapp() {
    //create level match
    this.map = this.game.add.tilemap('level1')
    //create blank rangeMap
    this.rangeMap = game.add.tilemap(null, tile_size_x, tile_size_y);

    //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
    this.map.addTilesetImage('gameTiles')
    this.rangeMap.addTilesetImage('tiles');

    //create layer
    this.layer = this.map.createLayer(0)
    this.rangeLayer = this.rangeMap.createBlankLayer("RangeLayer", 30, 30, tile_size_x, tile_size_y)

    this.layer.resizeWorld()
    this.rangeLayer.resizeWorld()

    //make range layer transparent
    this.rangeLayer.alpha = 0.5
  }

  initMapJSON() {
    this.map = this.game.add.tilemap('level1')

    //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
    this.map.addTilesetImage('tileset', 'gameTiles')

    //create layer
    this.colliderLayer = this.map.createLayer('ColliderLayer')
    this.playFieldLayer = this.map.createLayer('PlayFieldLayer')

    this.colliderLayer.resizeWorld()
  }

  initMap() {
    var data = '';
    var size_x = 30;
    var size_y = 30;
    for (var y = 0; y < size_y; y++)
    {
      for (var x = 0; x < size_x; x++)
      {
        // data += game.rnd.between(0, 47).toString();
        data += "0"
        if (x < size_x-1)
        {
          data += ',';
        }
      }

      if (y < size_y-1)
      {
        data += "\n";
      }
    }

    var data2 = '';
    var size_x = 30;
    var size_y = 30;
    for (var y = 0; y < size_y; y++)
    {
      for (var x = 0; x < size_x; x++)
      {
        // data += game.rnd.between(0, 47).toString();
        data2 += "40"
        if (x < size_x-1)
        {
          data2 += ',';
        }
      }

      if (y < size_y-1)
      {
        data2 += "\n";
      }
    }
    game.cache.addTilemap('dynamicMap', null, data, Phaser.Tilemap.CSV);

    game.cache.addTilemap('dynamicMap2', null, "", Phaser.Tilemap.CSV);
    //  Create our map (the 16x16 is the tile size)
    this.map = game.add.tilemap('dynamicMap', tile_size_x, tile_size_y);

    this.rangeMap = game.add.tilemap(null, tile_size_x, tile_size_y);
    //  'tiles' = cache image key, 16x16 = tile size
    this.map.addTilesetImage('tiles', 'tiles', tile_size_x, tile_size_y);
    // this.rangeMap.addTilesetImage('tiles', 'tiles', tile_size_x, tile_size_y);
    this.rangeMap.addTilesetImage('tiles');
    //  0 is important
    this.layer = this.map.createLayer(0);
    // this.rangeLayer = this.rangeMap.createLayer(0);
    this.rangeLayer = this.rangeMap.createBlankLayer("RangeLayer", 30, 30, tile_size_x, tile_size_y)

    this.layer.alpha = 1
    this.rangeLayer.alpha = 0.5

    // let xxx = this.rangeMap.getTile(10,10)
    // console.log(xxx)
    //  Scroll it
    this.layer.resizeWorld();
    this.rangeLayer.resizeWorld();
  }

  initUnits() {
    let self = this
    let runner = 0
    // spawn_points.forEach(function(spawn_point){
    //   self.players.push(new PlayerUnit({
    //     game: self,
    //     x: spawn_points[runner].x*tile_size_x,
    //     y: spawn_points[runner].y*tile_size_y,
    //     asset: 'chara',
    //     name: self.game.repos[runner].repo_name,
    //     health: 10,
    //     num: runner,
    //   }))
    //   let tile = self.map.getTile(spawn_points[runner].x, spawn_points[runner].y)
    //   tile.properties['owner'] = self.players[runner++];
    // })

    this.players.push(new PlayerUnit({
      game: this,
      x: spawn_points[0].x*tile_size_x,
      y: spawn_points[0].y*tile_size_y,
      asset: 'chara',
      name: self.game.repos[0].repo_name,
      health: 10,
      num: 0,
    }))
    let tile = self.map.getTile(spawn_points[0].x, spawn_points[0].y)
    tile.properties['owner'] = this.players[0];

    this.players.push(new PlayerUnit({
      game: this,
      x: spawn_points[1].x*tile_size_x,
      y: spawn_points[1].y*tile_size_y,
      asset: 'chara',
      name: self.game.repos[1].repo_name,
      health: 10,
      num: 1,
    }))
    tile = self.map.getTile(spawn_points[1].x, spawn_points[1].y)
    tile.properties['owner'] = this.players[1];

    // this.players.push(new PlayerUnit({
    //   game: this,
    //   x: spawn_points[2].x*tile_size_x,
    //   y: spawn_points[2].y*tile_size_y,
    //   asset: 'chara',
    //   name: self.game.repos[2].repo_name,
    //   health: 10,
    //   num: 2,
    // }))
    // tile = self.map.getTile(spawn_points[2].x, spawn_points[2].y)
    // tile.properties['owner'] = this.players[2];

    this.enemies.push(new EnemyUnit({
      game: this,
      x: spawn_points[2].x*tile_size_x,
      y: spawn_points[2].y*tile_size_y,
      asset: 'chara',
      name: self.game.repos[2].repo_name,
      health: 10,
      num: 2,
    }))
    tile = self.map.getTile(spawn_points[2].x, spawn_points[2].y)
    tile.properties['owner'] = this.enemies[0];

    this.players.forEach(function(unit){
      unit.calculateActTurn(0)
      this.units.queue(unit)
    }, this)

    this.enemies.forEach(function(unit){
      unit.calculateActTurn(0)
      this.units.queue(unit)
    }, this)

    this.unit_log = this.players.concat(this.enemies)
    this.unit_log.forEach(function(unit){
      console.log(unit.name + " act turn = " + unit.act_turn )
    })
  }

  next_turn() {
    this.unit_log.forEach(function(unit){
      console.log(unit.name + " act turn = " + unit.act_turn )
    })

    this.clearTurn();
    console.log(this.units)
    this.current_unit = this.units.dequeue();
    console.log("HEALTH: " + this.current_unit.health)
    console.log(this.units.length)
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

  // init_player_actions (position) {
  //   var self = this
  //
  //   var actions, actions_menu_items, action_index, actions_menu
  //
  //   // Available Action
  //   actions = [
  //     {text: "Attack", item_constructor: AttackMenuItem.prototype.constructor},
  //     {text: "Skill", item_constructor: SkillMenuItem.prototype.constructor},
  //     {text: "Walk", item_constructor: WalkMenuItem.prototype.constructor},
  //     {text: "Endturn", item_constructor: EndTurnMenuItem.prototype.constructor}
  //   ]
  //   actions_menu_items = []
  //   action_index = 0;
  //
  //   // Create a menu item for each action
  //   actions.forEach(function (action) {
  //     actions_menu_items.push(new action.item_constructor(this, action.text+"_menu_item", {x: position.x, y:position.y + action_index * 35}, {group: "hud", text: action.text, style: Object.create(self.TEXT_STYLE)}));
  //     action_index++;
  //   }, this);
  //   this.actions_menu = new Menu(this, "actions_menu", position, {group: "hud", menu_items: actions_menu_items})
  // }

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
      console.log(action.name);
    }, this);
    this.skills_menu.menu_items = actions_menu_items
    this.disableUnitSkillCommandHud()
  }

  render () {

  }
}
