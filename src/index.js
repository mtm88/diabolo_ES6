import GameState from 'states/GameState';
import Preload from 'states/Preload';


class Game extends Phaser.Game {

  constructor() {
    super(500, 500, Phaser.AUTO, 'content', null);
    this.state.add('Preload', Preload, false);
    this.state.add('GameState', GameState, false);
    this.state.start('Preload');
  }
}




new Game();
