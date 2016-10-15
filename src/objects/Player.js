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

  playerMovement() {
    this.body.velocity.y = 0;
    this.body.velocity.x = 0;

    if (this.cursors.up.isDown) {
      this.body.velocity.y -= 50;
      if (this.cursors.right.isDown) this.animations.play('right');
      else if (this.cursors.left.isDown) this.animations.play('left');
      else this.animations.play('up');
    } else if (this.cursors.down.isDown) {
      this.body.velocity.y += 50;
      if (this.cursors.right.isDown) this.animations.play('right');
      else if (this.cursors.left.isDown) this.animations.play('left');
      else this.animations.play('down');
    } else if (!this.cursors.left.isDown && !this.cursors.right.isDown) {
      this.animations.stop();
    }

    if (this.cursors.left.isDown) {
      this.body.velocity.x -= 50;
      this.animations.play('left');
    } else if (this.cursors.right.isDown) {
      this.body.velocity.x += 50;
      this.animations.play('right');
    } else if (!this.cursors.up.isDown && !this.cursors.down.isDown) {
      this.animations.stop();
    }
  }

}

export default Player;
