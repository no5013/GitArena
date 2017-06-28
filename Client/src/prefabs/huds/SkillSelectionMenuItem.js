import Phaser from 'phaser'
import MenuItem from './MenuItem'

import SkillCommand from '../../commands/SkillCommand'

var skill;

export default class extends MenuItem{
  constructor (game_state, name, position, properties) {
    super(game_state, name, position, properties)
    this.game_state = game_state
    skill = properties.skill
    console.log(this.skill)
  }

  select () {
    let game_state = game.state.states.Game
    let unit = game_state.current_unit

    game_state.properties.ActionStateVar['command'] = new SkillCommand(game_state, unit.name + "_skill_" + skill.name, {x: 0,y: 0}, {
      target: null,
      skill: skill,
      group: "hud",
      owner_name: unit.name
    })

    game_state.currentState.setNextState(game_state.ActionState.TargetSelectionState)
    game_state.currentState.nextState();
  }
}
