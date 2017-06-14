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
    // I think it 32x32
    game.load.image('tiles', '../assets/tiles/gridtiles.png')
    game.load.spritesheet('chara', '../assets/images/vx_chara01.png', 32, 48);
  }

  create () {
    this.initMap()

    this.initMarker()

    this.initCharacters()

    game.physics.startSystem(Phaser.Physics.ARCADE);

    cursors = game.input.keyboard.createCursorKeys();
    this.cursors = cursors
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

    if(this.isMoving){
      return false;
    }
    this.isMoving = true;
    game.camera.follow(sprite)

    var characterMovement = game.add.tween(sprite);
    characterMovement.to({x:cell_x*32, y: cell_y*32}, distance/move_speed);
    characterMovement.onComplete.add(function(){
      this.isMoving = false
      sprite.properties['selected'] = false
      game.camera.follow(null)
    }, this)
    characterMovement.start();
  }

  getTileProperties() {
    var x = layer.getTileX(game.input.activePointer.worldX);
    var y = layer.getTileY(game.input.activePointer.worldY);
    var tile = map.getTile(x, y, layer);
    var owner = tile.properties['owner']

    if(owner){
      moving['character'] = owner
      moving['fromTile'] = tile
      moving['isSelected'] = true
      owner.properties['selected'] = true
      owner.pickedUp()
      console.log(`SELECT ${owner.textname.text}`)
    }
    else if(moving['isSelected']){
      moving['character'].pickedDown()
      this.moveCharacter(moving['character'], x, y)
      tile.properties['owner'] = moving['character']
      moving['fromTile'].properties['owner'] = null
      this.clearMoving()
    }
  }

  clearMoving() {
    moving['isSelected'] = false
  }

  updateMarker() {
    marker.x = layer.getTileX(game.input.activePointer.worldX) * 32;
    marker.y = layer.getTileY(game.input.activePointer.worldY) * 32;
  }

  initMarker() {
    // mouse input
    marker = game.add.graphics();
    marker.lineStyle(2, 0xffffff, 1);
    marker.drawRect(0, 0, 32, 32);
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
    map = game.add.tilemap('dynamicMap', 32, 32);
    //  'tiles' = cache image key, 16x16 = tile size
    map.addTilesetImage('tiles', 'tiles', 32, 32);
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
        x: spawn_points[runner].x*32,
        y: spawn_points[runner].y*32,
        asset: 'chara',
        name: self.game.repos[runner].repo_name,
        num: runner,
      }))
      self.game.add.existing(players[runner])
      let tile = map.getTile(spawn_points[runner].x, spawn_points[runner].y)
      tile.properties['owner'] = players[runner++];
    })
  }

  render () {

  }
}
