const mqtt = require('mqtt');

import RainbowText from 'objects/RainbowText';
import Player from 'objects/Player';


class GameState extends Phaser.State {

  create() {

    this.map = this.game.add.tilemap('level2');

    // // the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
    this.map.addTilesetImage('roguelikeSheet_transparent', 'gameTiles');

    // // create layer
    this.ground = this.map.createLayer('ground');
    this.ground_two = this.map.createLayer('ground_two');
    this.trees = this.map.createLayer('trees');
    this.house_bottoms = this.map.createLayer('house_bottoms');
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
    this.player = new Player(this.game, playerSpawn[0].x, playerSpawn[0].y, 'player');
    this.objectsToCollide = [this.house_bottoms, this.trees];

    // this changes the order layers are rendered so player goes underneath the trees etc.
    this.game.world.swap(this.house_tops, this.player);
    this.game.world.swap(this.transparentBlockers, this.houseBottom);
    this.game.world.swap(this.houseBottom, this.houseTop);


    this.mqtt = mqtt.connect('mqtt://localhost:1887');
    const mq = this.mqtt;
    mq.on('connect', () => {
      console.log('connected!');

      const tempPlayerName = `newPlayer${Math.floor((Math.random() * 10000) + 1)}`;

      mq.subscribe(tempPlayerName);

      mq.on('message', (topic, payload) => {
        if (topic === tempPlayerName) {
          this.player.id = payload.toString();
          mq.unsubscribe(tempPlayerName);
          mq.subscribe('players');
          mq.publish('players', JSON.stringify({ playerId: this.player.id, position: { x: this.player.x, y: this.player.y } }));
        }

        if (topic === 'players') {
          const player = payload.toString();
          console.log(payload.toString());
        }

      });


    });


    // this.game.physics.arcade.enable(this.player);

    // the camera will follow the player in the world
    // this.game.camera.follow(this.player);

    // this.game.add.audio('diablo-tristram').play();
  }

  update() {
    this.playerMovement();
    this.player.collisions(this.objectsToCollide);
  }

  playerMovement() {
    this.player.body.velocity.y = 0;
    this.player.body.velocity.x = 0;
    this.mqtt.publish('players', JSON.stringify({ playerId: this.player.id, position: { x: this.player.x, y: this.player.y } }));

    if (this.player.cursors.up.isDown) {
      this.player.body.velocity.y -= 50;
      if (this.player.cursors.right.isDown) this.player.animations.play('right');
      else if (this.player.cursors.left.isDown) this.player.animations.play('left');
      else this.player.animations.play('up');
    } else if (this.player.cursors.down.isDown) {
      this.player.body.velocity.y += 50;
      if (this.player.cursors.right.isDown) this.player.animations.play('right');
      else if (this.player.cursors.left.isDown) this.player.animations.play('left');
      else this.player.animations.play('down');
    } else if (!this.player.cursors.left.isDown && !this.player.cursors.right.isDown) {
      this.player.animations.stop();
    }

    if (this.player.cursors.left.isDown) {
      this.player.body.velocity.x -= 50;
      this.player.animations.play('left');
    } else if (this.player.cursors.right.isDown) {
      this.player.body.velocity.x += 50;
      this.player.animations.play('right');
    } else if (!this.player.cursors.up.isDown && !this.player.cursors.down.isDown) {
      this.player.animations.stop();
    }
  }

  // find objects in a Tiled layer that containt a property called "type" equal to a certain value
  findObjectsByType(type, map, layer) {
    this.result = [];
    map.objects[layer].forEach((element) => {
      if (element.properties.type === type) {
        // Phaser uses top left, Tiled bottom left so we have to adjust the y position
        // also keep in mind that the cup images are a bit smaller than the tile which is 16x16
        // so they might not be placed in the exact pixel position as in Tiled
        element.y -= map.tileHeight;
        this.result.push(element);
      }
    });
    return this.result;
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
