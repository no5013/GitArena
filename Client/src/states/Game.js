/* globals __DEV__ */
import Phaser from 'phaser'
import RepoHero from '../sprites/RepoHero'

var cursors
var camera_speed = 5;

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
    let map = game.add.tilemap('dynamicMap', 32, 32);

    //  'tiles' = cache image key, 16x16 = tile size
    map.addTilesetImage('tiles', 'tiles', 32, 32);

    //  0 is important
    let layer = map.createLayer(0);

    //  Scroll it
    layer.resizeWorld();

    game.physics.startSystem(Phaser.Physics.ARCADE);

    cursors = game.input.keyboard.createCursorKeys();
    this.cursors = cursors

    this.game.player = new RepoHero({
      game: this,
      x: spawn_points[0].x*32,
      y: spawn_points[0].y*32,
      asset: 'chara',
      name: this.game.user.username
    })
    this.game.add.existing(this.game.player)
  }

  update () {

    console.log(game.isMoving)
    if (cursors.left.isDown)
    {
      this.moveCharacter(game.player,5,10)
    }
    else if (cursors.right.isDown)
    {
      this.moveCharacter(game.player,15,10)
    }
    else if (cursors.up.isDown)
    {
      // game.camera.y-=camera_speed;
      // this.game.player.move("up",1)
      this.moveCharacter(game.player,10,5)
    }
    else if (cursors.down.isDown)
    {
      this.moveCharacter(game.player,10,15)
    }
  }

  moveCharacter(sprite, cell_x, cell_y) {
    let currenctCell_x = sprite.x/32
    let currenctCell_y = sprite.y/32

    let diff_x = Math.abs(currenctCell_x - cell_x)
    let diff_y = Math.abs(currenctCell_y - cell_y)

    let speed = 100

    if(this.isMoving){
      return false;
    }
    this.isMoving = true;

    var characterMovement = game.add.tween(sprite);
    characterMovement.to({x:cell_x*32, y: cell_y*32},diff_x*speed);
    characterMovement.onComplete.add(function(){
      this.isMoving = false
    }, this)
    characterMovement.start();

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
