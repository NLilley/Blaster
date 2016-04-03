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
        if (enemyToReset == null) return;

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
 */
let updateIndicators = (game, player, enemies) => {
    enemies.map(enemy => {
        if (!enemy.alive) {
            removeIndicator(enemy);
            return;
        }

        if (shouldDisplayIndicator(enemy, game.camera)) {
            if(!enemy.c.indicator.alive) placeIndicator(enemy);
            positionIndicator(player, enemy);
        } else {
            removeIndicator(enemy)
        }
    });
};

/**
 * Place an indicator in the camera view so that the player can see enemies that are off screen.
 * @param enemy Enemy to place an indicator for
 */
let placeIndicator = (enemy) => {
    enemy.c.indicator.reset(enemy.position.x, enemy.position.y);
};

/**
 * Remove indicator from the world
 * @param enemy Enemy with indicator
 */
let removeIndicator = enemy => {
    enemy.c.indicator.kill();
};

/**
 * Determine if an indicator should be placed for an enemy unit.
 * @param enemy Enemy to check
 * @param {Phaser.Camera} camera Phaser camera
 * @return Boolean
 */
let shouldDisplayIndicator = (enemy, camera) => {
    return !inCamera(enemy, camera);
};

/**
 * Position an indicator so that it is on the edge of the players camera
 * @param player The player who should have an indicator positioned for them.
 * @param enemy The enemy which the indicator represents.
 */
let positionIndicator = (player, enemy) => {
    let directionVector = new Phaser.Point(
        enemy.position.x - player.position.x,
        enemy.position.y - player.position.y
    ).normalize();

    enemy.c.indicator.rotation = constants.ZERO_VECTOR.angle(directionVector);

    enemy.c.indicator.position = directionVector
        .multiply(constants.INDICATOR_RADIUS, constants.INDICATOR_RADIUS)
        .add(
            player.position.x,
            player.position.y
        );
};


export {state}