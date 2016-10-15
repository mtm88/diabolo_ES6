import RainbowText from 'objects/RainbowText';

class GameState extends Phaser.State {

  create() {
    this.map = this.game.add.tilemap('level2');

    // // the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
    this.map.addTilesetImage('roguelikeSheet_transparent', 'gameTiles');

    // // create layer
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

    this.game.add.audio('diablo-tristram').play();
  }

  update() {
    this.playerMovement();
    this.collisions();
  }

  collisions() {
    this.game.physics.arcade.collide(this.player, this.house_bottoms);
    this.game.physics.arcade.collide(this.player, this.trees);
  }

  playerMovement() {
    this.player.body.velocity.y = 0;
    this.player.body.velocity.x = 0;

    if (this.cursors.up.isDown) {
      this.player.body.velocity.y -= 150;
      if (this.cursors.right.isDown) this.player.animations.play('right');
      else if (this.cursors.left.isDown) this.player.animations.play('left');
      else this.player.animations.play('up');
    } else if (this.cursors.down.isDown) {
      this.player.body.velocity.y += 150;
      if (this.cursors.right.isDown) this.player.animations.play('right');
      else if (this.cursors.left.isDown) this.player.animations.play('left');
      else this.player.animations.play('down');
    } else if (!this.cursors.left.isDown && !this.cursors.right.isDown) {
      this.player.animations.stop();
    }

    if (this.cursors.left.isDown) {
      this.player.body.velocity.x -= 150;
      this.player.animations.play('left');
    } else if (this.cursors.right.isDown) {
      this.player.body.velocity.x += 150;
      this.player.animations.play('right');
    } else if (!this.cursors.up.isDown && !this.cursors.down.isDown) {
      this.player.animations.stop();
    }
  }


  // find objects in a Tiled layer that containt a property called "type" equal to a certain value
  findObjectsByType(type, map, layer) {
    const result = [];
    map.objects[layer].forEach((element) => {
      if (element.properties.type === type) {
        // Phaser uses top left, Tiled bottom left so we have to adjust the y position
        // also keep in mind that the cup images are a bit smaller than the tile which is 16x16
        // so they might not be placed in the exact pixel position as in Tiled
        element.y -= map.tileHeight;
        result.push(element);
      }
    });
    return result;
  }

  // create a sprite from an object
  createFromTiledObject(element, group) {
    const sprite = group.create(element.x, element.y, element.properties.sprite);
    // copy all properties to the sprite
    Object.keys(element.properties).forEach((key) => {
      sprite[key] = element.properties[key];
    });
    return sprite;
  }

  createHouseDoors() {
    this.doors = this.game.add.group();
    this.doors.enableBody = true;
    const result = this.findObjectsByType('doors', this.map, 'houseDoors');
    const doors = this.createFromTiledObject(result[0], this.doors);
    doors.anchor.setTo(0, 0.48);

    // in case there's more then 1 doors
    // result.forEach(function (element) {
    //   this.createFromTiledObject(element, this.doors);
    // }, this);
  }


}

export default GameState;
