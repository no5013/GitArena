import Phaser from 'phaser'
import UnitPrefab from './UnitPrefab'
import Util from '../../util/Util'
import MoveCommand from '../../commands/MoveCommand'
import NormalAttackCommand from '../../commands/NormalAttackCommand'
import EndTurnCommand from '../../commands/EndTurnCommand'
import ActionCommand from '../../commands/ActionCommand'

export default class extends UnitPrefab{
  constructor (game_state, name, position, properties) {
    // super(game, x, y, asset, name, health, num, properties)
    super(game_state, name, position, properties)

  }

  act () {

  }

  getCommand(){
    var command_list = []
    var move_command, attack_command

    let random_tile_x = Math.floor(Math.random()*10)+1
    let random_tile_y = Math.floor(Math.random()*10)+1

    let target_index = Math.floor(Math.random() * this.game_state.groups.player_units.countLiving())
    let target = this.game_state.groups.player_units.children[target_index];
    console.log(target)

    if(target){
      let target_tile_x = this.game_state.layer.getTileX(target.x);
      let target_tile_y = this.game_state.layer.getTileY(target.y);

      let next_move = this.getAttempMoveCoordinate(target_tile_x, target_tile_y)

      move_command = new MoveCommand(this.game_state, this.name+"_move", {x: this.x, y: this.y}, {
        coordinate: {
          x: next_move.x,
          y: next_move.y
        },
        group: "hud",
        owner: this
      })
      command_list.push(move_command)

      let self = this;
      var tile, unit, attacked;
      console.log("NEXTMOVE: " + next_move.x + " " + next_move.y)
      var possible_attacks = this.game_state.getAttackRangeCoordinate(next_move.x, next_move.y, this.attackRange)
      possible_attacks.forEach(function(attack){
        tile = self.game_state.map.getTile(attack.x, attack.y, self.game_state.layer)
        // check if tile exist
        if(tile){
          unit = tile.properties['owner']
          // if there has unit there and still haven't attack
          if(unit && unit===target &&!attacked){
            console.log(tile)
            attacked = true
            attack_command = new NormalAttackCommand(self.game_state, self.name+"_attack", {x: 0,y: 0}, {
              target: target,
              group: "hud",
              owner: self
            })
            command_list.push(attack_command)
          }
        }
      })
    }
    else {
      console.log("win")
    }
    // var move_command = new MoveCommand(this.game_state, this.name+"_move", {x: this.x, y: this.y}, {
    //   coordinate: {
    //     x: 15,
    //     y: 10
    //   },
    //   group: "hud",
    //   owner_name: this.name
    // })
    //
    // var attack_command = new NormalAttackCommand(this.game_state, this.name+"_attack", {x: 0,y: 0}, {
    //   target: this.game_state.players[0],
    //   group: "hud",
    //   owner_name: this.name
    // })

    var endTurn_command = new EndTurnCommand(this.game_state, this.name+"_endturn", {x: 0,y: 0}, {
      group: "hud",
      owner: this
    })

    command_list.push(endTurn_command)

    return command_list
  }

  getAttempMoveCoordinate(target_tile_x, target_tile_y) {
    let current_unit_tile_x = this.game_state.layer.getTileX(this.x);
    let current_unit_tile_y = this.game_state.layer.getTileY(this.y);

    let direction = Util.directionOfVector(current_unit_tile_x, current_unit_tile_y, target_tile_x, target_tile_y)

    let offset_x = 0
    let offset_y = 0

    var temp_walk_tile_x = current_unit_tile_x
    var temp_walk_tile_y = current_unit_tile_y
    var temp_direction

    for(let i=0; i<this.movingRange; i++){
      temp_direction = Util.directionOfVector(temp_walk_tile_x, temp_walk_tile_y, target_tile_x, target_tile_y)


      if(temp_direction == "left" && !this.game_state.map.getTile(temp_walk_tile_x-1, temp_walk_tile_y).properties['owner'] ){
        temp_walk_tile_x -= 1
      }
      else if(temp_direction == "right" && !this.game_state.map.getTile(temp_walk_tile_x+1, temp_walk_tile_y).properties['owner']){
        temp_walk_tile_x +=1
      }
      else if(temp_direction == "up" && !this.game_state.map.getTile(temp_walk_tile_x, temp_walk_tile_y-1).properties['owner']){
        temp_walk_tile_y -= 1
      }
      else if(temp_direction == "down" && !this.game_state.map.getTile(temp_walk_tile_x, temp_walk_tile_y+1).properties['owner']){
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
}
