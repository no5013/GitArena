/* globals __DEV__ */
import Phaser from 'phaser'
import Util from '../util/Util'
import RepoHero from '../sprites/RepoHero'

const tile_size_x = 32
const tile_size_y = 32

var cursors
var camera_speed = 5;
var marker;
var layer;
var map;
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
    // players.forEach(function(player){
    //   player.setActive();
    // })
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

  moveCharacter(sprite, cell_x, cell_y) {
    let currenctCell_x = sprite.x/tile_size_x
    let currenctCell_y = sprite.y/tile_size_y

    let distance = Util.distanceBetweenPoint(cell_x,cell_y,currenctCell_x,currenctCell_y)

    if(this.isMoving){
      return false;
    }
    this.isMoving = true;
    game.camera.follow(sprite)

    var characterMovement = game.add.tween(sprite);
    characterMovement.to({x:cell_x*tile_size_x, y: cell_y*tile_size_y}, distance/move_speed);
    characterMovement.onComplete.add(function(){
      this.isMoving = false
      game.camera.follow(null)
      sprite.setDeactive();
    }, this)
    characterMovement.start();
  }

  getTileProperties() {
    var x = layer.getTileX(game.input.activePointer.worldX);
    var y = layer.getTileY(game.input.activePointer.worldY);
    var tile = map.getTile(x, y, layer);
    var owner = tile.properties['owner']

    if(owner && !moving['character']){
      if(!owner.properties.active){
        console.log("INACTIVE")
        return;
      }
      moving['character'] = owner
      moving['fromTile'] = tile
      owner.selected()
      console.log(`SELECT ${owner.textname.text}`)
    }
    else if(owner && moving['character']){
      moving['character'].attack(owner)
      // moving['character'].unselected()
      // moving['character'].properties['active'] = false
      moving['character'].setDeactive();
      this.clearMoving()
    }
    else if(moving['character']){
      console.log(moving['character'])
      this.moveCharacter(moving['character'], x, y)
      tile.properties['owner'] = moving['character']
      moving['fromTile'].properties['owner'] = null
      this.clearMoving()
    }
  }

  clearMoving() {
    moving['character'] = null
  }

  updateMarker() {
    marker.x = layer.getTileX(game.input.activePointer.worldX) * tile_size_x;
    marker.y = layer.getTileY(game.input.activePointer.worldY) * tile_size_y;
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
    game.cache.addTilemap('dynamicMap', null, data, Phaser.Tilemap.CSV);
    //  Create our map (the 16x16 is the tile size)
    map = game.add.tilemap('dynamicMap', tile_size_x, tile_size_y);
    //  'tiles' = cache image key, 16x16 = tile size
    map.addTilesetImage('tiles', 'tiles', tile_size_x, tile_size_y);
    //  0 is important
    layer = map.createLayer(0);
    //  Scroll it
    layer.resizeWorld();
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
      let tile = map.getTile(spawn_points[runner].x, spawn_points[runner].y)
      tile.properties['owner'] = players[runner++];
    })
  }

  next_turn() {
    current_unit = players.shift();
    current_unit.setActive()
    players.push(current_unit)
  }

  render () {

  }
}
