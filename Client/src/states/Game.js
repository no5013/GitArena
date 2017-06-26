/* globals __DEV__ */
import Phaser from 'phaser'
import Util from '../util/Util'
import RepoHero from '../prefabs/units/RepoHero'
import PlayerUnit from '../prefabs/units/PlayerUnit'
import EnemyUnit from '../prefabs/units/EnemyUnit'

import TextPrefab from '../prefabs/TextPrefab'

import UnitSelectState from '../StateMachine/ActionState/UnitSelectState'
import WalkState from '../StateMachine/ActionState/WalkState'
import SkillState from '../StateMachine/ActionState/SkillState'
import ActionSelectState from '../StateMachine/ActionState/ActionSelectState'
import EndTurnState from '../StateMachine/ActionState/EndTurnState'
import WalkedState from '../StateMachine/ActionState/WalkedState'
import EnemyActionState from '../StateMachine/ActionState/EnemyActionState'

import Menu from '../prefabs/huds/Menu'
import DamageText from '../prefabs/huds/DamageText'

import AttackMenuItem from '../prefabs/huds/AttackMenuItem'
import WalkMenuItem from '../prefabs/huds/WalkMenuItem'
import EndTurnMenuItem from '../prefabs/huds/EndTurnMenuItem'

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
      SkillState: new SkillState(self),
      ActionSelectState: new ActionSelectState(self),
      EndTurnState: new EndTurnState(self),
      WalkedState: new WalkedState(self),
      EnemyActionState: new EnemyActionState(self)
    }
    this.properties = {
      ActionStateVar: {}
    }

    this.groups = {
      hud: this.game.add.group()
    }
    this.prefabs = {}
    this.players = []
  }

  preload () {
    // I think it tile_size_xxtile_size_x
    game.load.image('tiles', '../assets/tiles/gridtiles.png')

    game.load.image('rectangle_image', '../assets/huds/rectangle.png')

    game.load.spritesheet('chara', '../assets/images/vx_chara01.png', tile_size_x, 48);

    // Load temp button
    game.load.spritesheet('button', 'assets/images/button_sprite_sheet.png', 193, 71);
  }

  create () {

    this.initMap()

    this.initMarker()

    this.initCharacters()

    game.physics.startSystem(Phaser.Physics.ARCADE);

    cursors = game.input.keyboard.createCursorKeys();

    this.next_turn();
    this.setActionState(this.ActionState.UnitSelectState)

    this.TEXT_STYLE = {font: "30px Arial", fill: "#FFFFFF"}
    this.HUD_TEXT_STYLE = {font: "16px Arial", fill: "#FFFFFF"}
    this.show_player_actions({x:400, y:100});
    this.disableActionCommandHud();

    game.world.bringToTop(this.groups.hud);
  }

  enableActionCommandHud(){
    this.prefabs['actions_menu'].enable();
    this.prefabs['actions_menu'].show();
  }

  disableActionCommandHud(){
    this.prefabs['actions_menu'].disable();
    this.prefabs['actions_menu'].hide();
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
      var test_text = new DamageText(this, "test_text", {x:200, y:200}, {
        group: "hud",
        text: "test",
        style: Object.create(this.HUD_TEXT_STYLE),
        distance: 30,
        duration: 1000
      })

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
    var tileToPush = this.getAttackRangeCoordinate(unit);
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
    var tileToPush = this.getAttackRangeCoordinate(unit);
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

  getAttackRangeCoordinate(unit){
    let x = unit.x/tile_size_x
    let y = unit.y/tile_size_y

    var possibleAttack = []

    for(let j=0; j<=unit.attackRange; j++){
      for(let i=0; i<=unit.attackRange-j; i++){
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

  clearMoving() {
    moving['character'] = null
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

    game.cache.addTilemap('dynamicMap2', null, data2, Phaser.Tilemap.CSV);
    //  Create our map (the 16x16 is the tile size)
    this.map = game.add.tilemap('dynamicMap', tile_size_x, tile_size_y);

    this.rangeMap = game.add.tilemap('dynamicMap2', tile_size_x, tile_size_y);
    //  'tiles' = cache image key, 16x16 = tile size
    this.map.addTilesetImage('tiles', 'tiles', tile_size_x, tile_size_y);
    this.rangeMap.addTilesetImage('tiles', 'tiles', tile_size_x, tile_size_y);
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

  initCharacters() {
    let self = this
    // let runner = 0
    // spawn_points.forEach(function(spawn_point){
    //   players.push(new RepoHero({
    //     game: self,
    //     x: spawn_points[runner].x*tile_size_x,
    //     y: spawn_points[runner].y*tile_size_y,
    //     asset: 'chara',
    //     name: self.game.repos[runner].repo_name,
    //     health: 10,
    //     num: runner,
    //   }))
    //   self.game.add.existing(players[runner])
    //   let tile = self.map.getTile(spawn_points[runner].x, spawn_points[runner].y)
    //   tile.properties['owner'] = players[runner++];
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
    // self.game.add.existing(players[0])
    let tile = self.map.getTile(spawn_points[0].x, spawn_points[0].y)
    tile.properties['owner'] = this.players[0];

    this.players.push(new EnemyUnit({
      game: this,
      x: spawn_points[1].x*tile_size_x,
      y: spawn_points[1].y*tile_size_y,
      asset: 'chara',
      name: self.game.repos[1].repo_name,
      health: 10,
      num: 1,
    }))
    // self.game.add.existing(players[1])
    tile = self.map.getTile(spawn_points[1].x, spawn_points[1].y)
    tile.properties['owner'] = this.players[1];
  }

  next_turn() {
    this.clearTurn();
    this.current_unit = this.players.shift();

    if(this.players.length<=0){
      console.log("GAME OVER")
      return;
    }

    if(this.current_unit.alive){
      this.current_unit.setActive()
      // this.current_unit.act()
      this.players.push(this.current_unit)
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

  show_player_actions (position) {
    var self = this

    var actions, actions_menu_items, action_index, actions_menu

    // Available Action
    actions = [
      {text: "Attack", item_constructor: AttackMenuItem.prototype.constructor},
      {text: "Walk", item_constructor: WalkMenuItem.prototype.constructor},
      {text: "Endturn", item_constructor: EndTurnMenuItem.prototype.constructor}
    ]
    actions_menu_items = []
    action_index = 0;

    // Create a menu item for each action
    actions.forEach(function (action) {
      actions_menu_items.push(new action.item_constructor(this, action.text+"_menu_item", {x: position.x, y:position.y + action_index * 35}, {group: "hud", text: action.text, style: Object.create(self.TEXT_STYLE)}));
      action_index++;
    }, this);
    actions_menu = new Menu(this, "actions_menu", position, {group: "hud", menu_items: actions_menu_items})
  }

  render () {

  }
}
