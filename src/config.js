import Preload from './base_scenes/Preload';
import Boot from './base_scenes/Boot';
import Game from './base_scenes/Game';
import { SpinePlugin } from "@esotericsoftware/spine-phaser"
export default {
    type: Phaser.WEBGL,
    parent: "slot-game-phaser3",
    width: 1280,
    height: 720,
    //backgroundColor: '#ffffff',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 300 }
        }
    },
    fps: {
        min: 30,
        target: 60
    },
    scene: [Preload, Boot, Game],
    plugins: {
        scene: [{
            key: "spine.SpinePlugin",
            plugin: SpinePlugin,
            mapping: "spine"
        }]
    }
};