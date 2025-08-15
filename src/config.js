import Preload from './base_scenes/Preload';
import Game from './base_scenes/Game';
import { SpinePlugin } from "@esotericsoftware/spine-phaser"
export default {
    type: Phaser.WEBGL,
    parent: "slot-game-phaser3",
    width: 1280,
    height: 720,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 5000 },
            fps: 520
        }
    },
    fps: {
        min: 30,
        target: 60
    },
    scene: [Preload, Game],
    plugins: {
        scene: [{
            key: "spine.SpinePlugin",
            plugin: SpinePlugin,
            mapping: "spine"
        }]
    }
};