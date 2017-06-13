/* globals __DEV__ */
import Phaser from 'phaser'
import Util from '../util/Util'
import RepoHero from '../sprites/RepoHero'

var cursors
var camera_speed = 5;
var marker;
var layer;
var map;
var moving = {}
var players = []

export default class extends Phaser.State {

  init () {

  }
  preload () {
    // I think it 32x32
    game.load.image('tiles', '../assets/tiles/gridtiles.png')
    game.load.spritesheet('chara', '../assets/images/vx_chara01.png', 32, 48);
  }

  create () {
    var spawn_points = [
      {
        x: 10,
        y: 10
      },
      {
        x: 10,
        y: 12
      }
    ]

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
    map = game.add.tilemap('dynamicMap', 32, 32);
    //  'tiles' = cache image key, 16x16 = tile size
    map.addTilesetImage('tiles', 'tiles', 32, 32);
    //  0 is important
    layer = map.createLayer(0);
    //  Scroll it
    layer.resizeWorld();

    // mouse input
    marker = game.add.graphics();
    marker.lineStyle(2, 0xffffff, 1);
    marker.drawRect(0, 0, 32, 32);
    game.input.addMoveCallback(this.updateMarker, this);
    game.input.onDown.add(this.getTileProperties, this);

    game.physics.startSystem(Phaser.Physics.ARCADE);

    cursors = game.input.keyboard.createCursorKeys();
    this.cursors = cursors

    let self = this
    let runner = 0
    spawn_points.forEach(function(spawn_point){
      players.push(new RepoHero({
        game: self,
        x: spawn_points[runner].x*32,
        y: spawn_points[runner].y*32,
        asset: 'chara',
        name: self.game.repos[runner].repo_name
      }))
      self.game.add.existing(players[runner])
      let tile = map.getTile(spawn_points[runner].x, spawn_points[runner].y)
      tile.properties['owner'] = players[runner++];
    })


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

  moveCharacter(sprite, cell_x, cell_y) {
    let currenctCell_x = sprite.x/32
    let currenctCell_y = sprite.y/32

    let distance = Util.distanceBetweenPoint(cell_x,cell_y,currenctCell_x,currenctCell_y)
    let speed = 100

    if(this.isMoving){
      return false;
    }
    this.isMoving = true;
    game.camera.follow(sprite)

    var characterMovement = game.add.tween(sprite);
    characterMovement.to({x:cell_x*32, y: cell_y*32}, distance*speed);
    characterMovement.onComplete.add(function(){
      this.isMoving = false
      game.camera.follow(null)
    }, this)
    characterMovement.start();
  }

  getTileProperties() {
    var x = layer.getTileX(game.input.activePointer.worldX);
    var y = layer.getTileY(game.input.activePointer.worldY);
    var tile = map.getTile(x, y, layer);

    if(moving['isSelected']){
      if(tile===moving['fromTile'])
        return;
      this.moveCharacter(moving['character'], x, y)
      tile.properties['owner'] = moving['character']
      moving['fromTile'].properties['owner'] = null
      this.clearMoving()
      return;
    }

    var owner = tile.properties['owner']
    if(owner){
      moving['character'] = owner
      moving['fromTile'] = tile
      moving['isSelected'] = true
      console.log(`SELECT ${owner.textname.text}`)
    }
  }

  clearMoving() {
    moving['isSelected'] = false
  }

  updateMarker() {
    marker.x = layer.getTileX(game.input.activePointer.worldX) * 32;
    marker.y = layer.getTileY(game.input.activePointer.worldY) * 32;
  }
  // moveCharacter(sprite, cell_x, cell_y) {
  //   let currenctCell_x = sprite.x/32
  //   let currenctCell_y = sprite.y/32
  //
  //   let diff_x = Math.abs(currenctCell_x - cell_x)
  //   let diff_y = Math.abs(currenctCell_y - cell_y)
  //
  //   let speed = 200
  //
  //   console.log(diff_y)
  //
  //   if(game.isMoving)
  //     return false;
  //   game.isMoving = true;
  //
  //   if (diff_x == 0){
  //     var characterMovement_vertical = game.add.tween(sprite);
  //     characterMovement_vertical.to({y: cell_y*32},diff_y*speed);
  //     characterMovement_vertical.onComplete.add(function(){
  //       game.isMoving = false
  //     }, this)
  //     characterMovement_vertical.start();
  //   }
  //
  //   else if (diff_y == 0){
  //     var characterMovement_horizontal = game.add.tween(sprite);
  //     var characterMovement_vertical = game.add.tween(sprite);
  //
  //     characterMovement_horizontal.to({x: cell_x*32},diff_x*speed);
  //     characterMovement_horizontal.onComplete.add(function(){
  //       game.isMoving = false
  //     }, this)
  //     characterMovement_horizontal.start();
  //   }
  //   else {
  //     var characterMovement_horizontal = game.add.tween(sprite);
  //     var characterMovement_vertical = game.add.tween(sprite);
  //
  //     characterMovement_horizontal.to({x: cell_x*32},diff_x*speed);
  //     characterMovement_horizontal.onComplete.add(function(){
  //       characterMovement_vertical.start();
  //     }, this)
  //
  //     characterMovement_vertical.to({y: cell_y*32},diff_y*speed);
  //     characterMovement_vertical.onComplete.add(function(){
  //       game.isMoving = false
  //     }, this)
  //
  //     characterMovement_horizontal.start();
  //   }
  // }

  render () {
  }
}
