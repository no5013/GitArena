import Phaser from 'phaser'
import RepoHero from './RepoHero'
import Util from '../../util/Util'

export default class extends RepoHero{
  constructor (game, x, y, asset, name, health, num) {
    super(game, x, y, asset, name, health, num)
  }

  act () {

    let random_tile_x = Math.floor(Math.random()*10)+1
    let random_tile_y = Math.floor(Math.random()*10)+1

    let next_move = this.getNextMoveCoordinate()

    this.game.moveUnit(this, next_move.x, next_move.y, function(){

    })
  }

  getNextMoveCoordinate() {
    let target = this.game.players[0]
    console.log(target)

    let current_unit_tile_x = this.game.layer.getTileX(this.x);
    let current_unit_tile_y = this.game.layer.getTileY(this.y);

    let enemy_unit_tile_x = this.game.layer.getTileX(target.x);
    let enemy_unit_tile_y = this.game.layer.getTileX(target.y);

    let direction = Util.directionOfVector(current_unit_tile_x, current_unit_tile_y, enemy_unit_tile_x, enemy_unit_tile_y)

    let offset_x = 0
    let offset_y = 0

    var temp_walk_tile_x = current_unit_tile_x
    var temp_walk_tile_y = current_unit_tile_y
    var temp_direction

    for(let i=0; i<this.movingRange; i++){
      temp_direction = Util.directionOfVector(temp_walk_tile_x, temp_walk_tile_y, enemy_unit_tile_x, enemy_unit_tile_y)


      if(temp_direction == "left" && !this.game.map.getTile(temp_walk_tile_x-1, temp_walk_tile_y).properties['owner'] ){
        temp_walk_tile_x -= 1
      }
      else if(temp_direction == "right" && !this.game.map.getTile(temp_walk_tile_x+1, temp_walk_tile_y).properties['owner']){
        temp_walk_tile_x +=1
      }
      else if(temp_direction == "up" && !this.game.map.getTile(temp_walk_tile_x, temp_walk_tile_y-1).properties['owner']){
        temp_walk_tile_y -= 1
      }
      else if(temp_direction == "down" && !this.game.map.getTile(temp_walk_tile_x, temp_walk_tile_y+1).properties['owner']){
        temp_walk_tile_y +=1
      }
      else {
        console.log("REACH THE TARGET")
        break;
      }

    }

    // if(direction == "left"){
    //   offset_x = 1
    // }
    // else if(direction == "right"){
    //   offset_x = -1
    // }
    // else if(direction == "up"){
    //   offset_y = 1
    // }
    // else{
    //   offset_y = -1
    // }
    //
    // let move_coordinate = {
    //   x: enemy_unit_tile_x + offset_x,
    //   y: enemy_unit_tile_y + offset_y
    // }

    let move_coordinate = {
      x: temp_walk_tile_x,
      y: temp_walk_tile_y
    }

    return move_coordinate
  }
}
