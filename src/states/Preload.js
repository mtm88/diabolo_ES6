
class Preload extends Phaser.State {

  preload() {
    // show loading screen
    // this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
    // this.preloadBar.anchor.setTo(0.5);

    // this.load.setPreloadSprite(this.preloadBar);

    // load game assets

    this.load.tilemap('level2', './assets/tilesets/level2.json', null, Phaser.Tilemap.TILED_JSON);

    this.load.image('gameTiles', './assets/images/roguelike-pack/Spritesheet/roguelikeSheet_transparent.png');
    // // doors
    this.load.image('houseDoors', 'assets/images/rpgtile174.png');
    // // player animation spritesheet
    this.load.spritesheet('player', 'assets/images/ranger_f.png', 24, 32);
    // // soundtrack
    this.load.audio('diablo-tristram', 'assets/music/oldultima-stones.mp3');
  }


  create() {
    this.state.start('GameState');
  }
}

export default Preload;
