import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init (battle_data, level_data, next_state, extra_parameters) {
    this.battle_data = battle_data;
    this.level_data = level_data;
    this.next_state = next_state;
    this.extra_parameters = extra_parameters;
  }

  preload () {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    centerGameObjects([this.loaderBg, this.loaderBar])

    this.loadAssetFromJSON(this.level_data.assets)
    this.loadAssetFromJSON(this.battle_data.assets)

    this.level_data.enemy_encounters.forEach(function(enemy){
      var enemy_file = this.extra_parameters.units.enemies[enemy.name]
      console.log(enemy_file.name)
      this.load.spritesheet(enemy_file.name, enemy_file.asset.spritesheet_source, enemy_file.asset.frame_width, enemy_file.asset.frame_height, enemy_file.asset.frames, enemy_file.asset.margin, enemy_file.asset.spacing)
      this.load.text(enemy_file.name + "_mapper", enemy_file.asset.spritesheet_mapper_source)
    }, this)
  }

  loadAssetFromJSON(assets) {
    var asset_loader, asset_key, asset;
    for (asset_key in assets) { // load assets according to asset key
      if (assets.hasOwnProperty(asset_key)) {
        asset = assets[asset_key];
        switch (asset.type) {
          case "image":
          this.load.image(asset_key, asset.source);
          break;
          case "spritesheet":
          this.load.spritesheet(asset_key, asset.source, asset.frame_width, asset.frame_height, asset.frames, asset.margin, asset.spacing);
          break;
          case "tilemap":
          this.load.tilemap(asset_key, asset.source, null, Phaser.Tilemap.TILED_JSON);
          break;
        }
      }
    }
  }

  create () {
    this.game.state.start(this.next_state, true, false, this.battle_data, this.level_data, this.extra_parameters);
  }
}
