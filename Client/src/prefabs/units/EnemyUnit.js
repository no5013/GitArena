import Phaser from 'phaser'
import RepoHero from './RepoHero'
import Util from '../../util/Util'
import MoveCommand from '../../commands/MoveCommand'
import ActionCommand from '../../commands/ActionCommand'

export default class extends RepoHero{
  constructor (game, x, y, asset, name, health, num) {
    super(game, x, y, asset, name, health, num)
  }

  act () {

    let random_tile_x = Math.floor(Math.random()*10)+1
    let random_tile_y = Math.floor(Math.random()*10)+1

    let target = this.game.players[0]
    if(target){
      let target_tile_x = this.game.layer.getTileX(target.x);
      let target_tile_y = this.game.layer.getTileX(target.y);

      let next_move = this.getAttempMoveCoordinate(target_tile_x, target_tile_y)

      let self = this;
      var tile, unit, attacked;
      this.game.moveUnit(this, next_move.x, next_move.y, function(){
        var possible_attacks = self.game.getAttackRangeCoordinate(self)

        possible_attacks.forEach(function(attack){
          tile = self.game.map.getTile(attack.x, attack.y, self.game.layer)
          // check if tile exist
          if(tile){
            unit = tile.properties['owner']
            // if there has unit there and still haven't attack
            if(unit && !attacked){
              attacked = true
              self.attack(unit)
            }
          }
        })
        if(!attacked){
          self.game.currentState.nextState()
        }
      })
    }
    else {
      console.log("win")
    }
  }

  getCommand(){
    var move_command = new MoveCommand(this.game, this.name+"_move", {x: this.x, y: this.y}, {
      coordinate: {
        x: 15,
        y: 10
      },
      group: "hud",
      owner_name: this.name
    })
    return move_command
  }

  getAttempMoveCoordinate(target_tile_x, target_tile_y) {
    let current_unit_tile_x = this.game.layer.getTileX(this.x);
    let current_unit_tile_y = this.game.layer.getTileY(this.y);

    let direction = Util.directionOfVector(current_unit_tile_x, current_unit_tile_y, target_tile_x, target_tile_y)

    let offset_x = 0
    let offset_y = 0

    var temp_walk_tile_x = current_unit_tile_x
    var temp_walk_tile_y = current_unit_tile_y
    var temp_direction

    for(let i=0; i<this.movingRange; i++){
      temp_direction = Util.directionOfVector(temp_walk_tile_x, temp_walk_tile_y, target_tile_x, target_tile_y)


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

    let move_coordinate = {
      x: temp_walk_tile_x,
      y: temp_walk_tile_y
    }

    return move_coordinate
  }

  moveTo (dest_x, dest_y, callback){
    let distance = Util.distanceBetweenPoint(this.x,this.y, dest_x, dest_y)
    let direction = Util.directionOfVector(this.x, this.y, dest_x, dest_y)
    console.log(direction)

    if(this.isMoving){
      return false;
    }
    this.isMoving = true;
    this.animations.play(direction)

    var characterMovement = this.game.add.tween(this);
    characterMovement.to({x: dest_x, y: dest_y}, distance/this.move_speed);
    characterMovement.onComplete.add(function(){
      this.isMoving = false
      callback()
    }, this)
    characterMovement.start();
  }
}
