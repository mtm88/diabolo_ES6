import RainbowText from 'objects/RainbowText';

class GameState extends Phaser.State {

  create() {
    this.map = this.game.add.tilemap('level2');

    // the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
    this.map.addTilesetImage('roguelikeSheet_transparent', 'gameTiles');

    // create layer
    this.ground = this.map.createLayer('ground');
    this.ground_two = this.map.createLayer('ground_two');
    this.house_bottoms = this.map.createLayer('house_bottoms');
    this.trees = this.map.createLayer('trees');
    this.house_accs = this.map.createLayer('house_accs');
    this.house_tops = this.map.createLayer('house_tops');

    // this.createHouseDoors();

    // collisios setup
    this.map.setCollisionBetween(1, 1500, true, 'house_bottoms');
    this.map.setCollisionBetween(1, 1500, true, 'trees');

    // resizes the game world to match the layer dimensions
    this.ground.resizeWorld();

    // create player
    const playerSpawn = this.findObjectsByType('playerStart', this.map, 'playerStart');

    // we know there is just one result
    this.player = this.game.add.sprite(playerSpawn[0].x, playerSpawn[0].y, 'player');
    this.game.physics.arcade.enable(this.player);
    this.player.body.collideWorldBounds = true;

    // this changes the order layers are rendered so player goes underneath the trees etc.
    this.game.world.swap(this.house_tops, this.player);
    // this.game.world.swap(this.transparentBlockers, this.houseBottom);
    // this.game.world.swap(this.houseBottom, this.houseTop);

    this.player.frame = 8;
    this.player.animations.add('left', [9, 10, 11], 10, true);
    this.player.animations.add('right', [3, 4, 5], 10, true);
    this.player.animations.add('up', [0, 1, 2], 10, true);
    this.player.animations.add('down', [6, 7, 8], 10, true);

    this.game.physics.arcade.enable(this.player);

    // the camera will follow the player in the world
    this.game.camera.follow(this.player);

    // move player with cursor keys
    this.cursors = this.game.input.keyboard.createCursorKeys();

    // this.game.add.audio('diablo-tristram').play();
  }

}

export default GameState;
