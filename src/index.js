import Phaser from 'phaser';
import Config from './config';

export default class Game {
  constructor() {
    new Phaser.Game(Config);
  }

  resize() {
    let canvas = document.querySelector('canvas');

    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
  }
}

//event windows on load
window.onload = () => {
  const game = new Game();
  game.resize();
  window.addEventListener('resize', game.resize, false);
}