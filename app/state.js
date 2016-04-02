import * as constants from './constants'
import {inCamera} from './math'

let lastTimeEnemyAdded = 0;

/**
 * Control and maintain the game state
 * @param {Phaser.Game} game Phaser game object
 * @param aliveEnemies List of currently alive enemies
 * @param {Phaser.Group} enemies Phaser group of all enemmies
 * @param player Player game object
 * @param {Phaser.Group} indicators Phaser group of indicators
 */
var state = (game, aliveEnemies, enemies, player, indicators) => {
    spawnEnemies(game, aliveEnemies, enemies, player);
    updateIndicators(game, player, enemies, indicators);

};

/**
 * Check to see if enemies should be spawned and if so, spawn enemies.
 * @param {Phaser.Game} game Phaser game object
 * @param aliveEnemies List of currently alive enemies
 * @param {Phaser.Group} enemies Phaser group of all enemies
 * @param player Player game object.
 */
let spawnEnemies = (game, aliveEnemies, enemies, player) => {
    if (aliveEnemies.length < constants.ENEMY_AMOUNT_MAX &&
        game.time.now - lastTimeEnemyAdded > constants.ENEMY_SPAWN_RATE) {
        let enemyToReset = enemies.children.find(enemy => !enemy.alive);
        let spawnPoint = new Phaser.Point(500, 0);
        spawnPoint.rotate(0, 0, game.rnd.integerInRange(0, 360), true);
        enemyToReset.reset(player.x + spawnPoint.x, player.y + spawnPoint.y);
        lastTimeEnemyAdded = game.time.now;
    }
};

/**
 * To assist players, indicators are placed for enemies that are currently off screen.
 * This function places indicators for enemies out of range, and removes indicators as enemies
 * come back into range.
 * @param {Phaser.Game} game Phaser game object
 * @param player Player game object
 * @param {Phaser.Group} enemies Phaser group of enemies to indicate for
 * @param {Phaser.Group} indicators Phaser group of indicators to use.
 */
let updateIndicators = (game, player, enemies, indicators) => {
    enemies.map(enemy => {
        if(shouldPlaceIndicator(enemy, game.camera)){
            placeIndicator();
        }
    })
};

/**
 * Place an indicator in the camera view so that the player can see enemies that are off screen.
 * @param game
 * @param player
 * @param enemy
 * @param indicator
 */
let placeIndicator = (game, player, enemy, indicator) => {

};

/**
 * Determine if an indicator should be placed for an enemy unit.
 * @param {Phaser.Camera} camera Phaser camera
 * @param enemy Enemy to check
 * @return Boolean
 */
let shouldPlaceIndicator = (camera, enemy) => {
    return !inCamera(enemy, camera);
};


export {state}