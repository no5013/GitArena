/* globals __DEV__ */
import Phaser from 'phaser'
import Util from '../util/Util'
import RepoHero from '../sprites/RepoHero'

import UnitSelectState from '../StateMachine/ActionState/UnitSelectState'
import WalkState from '../StateMachine/ActionState/WalkState'

const tile_size_x = 32
const tile_size_y = 32

var cursors
var camera_speed = 5;
var marker;
var moving = {}
var players = []
var current_unit

const spawn_points = [
  {
    x: 5,
    y: 5
  },
  {
    x: 5,
    y: 7
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
      WalkState: new WalkState(self)
    }
    this.properties = {
      ActionStateVar: {}
    }

    this.currentState = this.ActionState.UnitSelectState
  }

  preload () {
    // I think it tile_size_xxtile_size_x
    game.load.image('tiles', '../assets/tiles/gridtiles.png')
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

    var turn_button = game.make.button(50, 50, 'button', this.actionOnClick, this, 2, 1, 0);
    game.add.existing(turn_button)

    this.next_turn();
  }

  actionOnClick () {
    console.log("next_turn")
    this.next_turn();
    console.log(current_unit.name)
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

    if(!current_unit.properties['active']){
      this.next_turn()
      console.log("NEXT_TURN")
    }
  }

  moveCharacter(unit, fromTile, toTile, callback) {
    game.camera.follow(unit)
    unit.moveTo(toTile.x*tile_size_x, toTile.y*tile_size_y, this.finishAction)
    toTile.properties['owner'] = unit
    fromTile.properties['owner'] = null
  }

  finishAction() {
    game.camera.follow(null)

    //get the current game state
    let self = game.state.states.Game
    self.currentState.nextState();
  }
  
  // getTileProperties() {
  //   var x = this.layer.getTileX(game.input.activePointer.worldX);
  //   var y = this.layer.getTileY(game.input.activePointer.worldY);
  //   var tile = this.map.getTile(x, y, this.layer);
  //   var moveTile = this.rangeMap.getTile(x, y, this.rangeLayer);
  //   var owner = tile.properties['owner']
  //
  //   if(owner && !moving['character']){
  //     if(!owner.properties.active){
  //       console.log("INACTIVE")
  //       return;
  //     }
  //     moving['character'] = owner
  //     moving['fromTile'] = tile
  //     owner.selected()
  //     this.showMovingRange(owner)
  //     console.log(`SELECT ${owner.textname.text}`)
  //   }
  //   else if(owner && moving['character']){
  //     this.removeMovingRange(moving['character'])
  //     moving['character'].attack(owner)
  //     // moving['character'].unselected()
  //     // moving['character'].properties['active'] = false
  //     moving['character'].setDeactive();
  //     this.clearMoving()
  //   }
  //   else if(moving['character'] && moveTile){
  //     console.log(moving['character'])
  //     this.removeMovingRange(moving['character'])
  //     this.moveCharacter(moving['character'], moving['fromTile'], tile)
  //     this.clearMoving()
  //   }
  // }

  getTileProperties() {
    var x = this.layer.getTileX(game.input.activePointer.worldX);
    var y = this.layer.getTileY(game.input.activePointer.worldY);

    this.currentState.selectTile(x, y)

  }

  showMovingRange(unit){
    let self = this
    var tileToPush = this.getMovingRangeCoordinate(unit);
    tileToPush.forEach(function(coordinate){
      self.rangeMap.putTile(new Phaser.Tile(self.rangeLayer,35,0,0,tile_size_x,tile_size_y),coordinate.x, coordinate.y, self.rangeLayer)
    })
  }

  removeMovingRange(unit){
    let self = this
    var tileToPush = this.getMovingRangeCoordinate(unit);
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

  clearMovingRange(unit){
    let walkingRange = 5
    let x = unit.x/tile_size_x
    let y = unit.y/tile_size_y
    this.rangeMap.putTile(new Phaser.Tile(this.rangeLayer,35,0,0,tile_size_x,tile_size_y),x, y, this.rangeLayer)
    this.rangeMap.putTile(new Phaser.Tile(this.rangeLayer,35,0,0,tile_size_x,tile_size_y),x+1, y, this.rangeLayer)
    this.rangeMap.putTile(new Phaser.Tile(this.rangeLayer,35,0,0,tile_size_x,tile_size_y),x-1, y, this.rangeLayer)
    this.rangeMap.putTile(new Phaser.Tile(this.rangeLayer,35,0,0,tile_size_x,tile_size_y),x, y+1, this.rangeLayer)
    this.rangeMap.putTile(new Phaser.Tile(this.rangeLayer,35,0,0,tile_size_x,tile_size_y),x, y-1, this.rangeLayer)
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
    let runner = 0
    spawn_points.forEach(function(spawn_point){
      players.push(new RepoHero({
        game: self,
        x: spawn_points[runner].x*tile_size_x,
        y: spawn_points[runner].y*tile_size_y,
        asset: 'chara',
        name: self.game.repos[runner].repo_name,
        health: 10,
        num: runner,
      }))
      self.game.add.existing(players[runner])
      let tile = self.map.getTile(spawn_points[runner].x, spawn_points[runner].y)
      tile.properties['owner'] = players[runner++];
    })
  }

  next_turn() {
    current_unit = players.shift();
    current_unit.setActive()
    players.push(current_unit)
  }

  setActionState(state) {
    this.currentState = state;
    this.currentState.enterState();
  }

  render () {

  }
}
