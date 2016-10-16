class Player extends Phaser.Sprite {
  constructor(game, x, y, key, frame) {
    super(game, x, y, key, frame);

    Phaser.Sprite.call(this, game, x, y, key);
    this.addAnimations();
    this.addPhysics();
    this.addMovement();
    game.add.existing(this);
    // might be a duplicate issue once i create more then 1 player
  }

  addAnimations() {
    this.frame = 8;
    this.animations.add('left', [9, 10, 11], 10, true);
    this.animations.add('right', [3, 4, 5], 10, true);
    this.animations.add('up', [0, 1, 2], 10, true);
    this.animations.add('down', [6, 7, 8], 10, true);
  }

  addPhysics() {
    this.game.physics.arcade.enable(this);
    this.body.collideWorldBounds = true;
  }

  addMovement() {
    this.cursors = this.game.input.keyboard.createCursorKeys();
  }

  collisions(objectsToCollide) {
    objectsToCollide.forEach((objectToColide) => {
      this.game.physics.arcade.collide(this, objectToColide);
    });
  }



}

export default Player;
