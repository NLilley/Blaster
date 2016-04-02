import * as constants from './constants'
import {accelerate, fireWeapon, capSpeed} from './action'

/**
 * Perform AI for non-player objects in the game
 * @param {Phaser.Game} game The game object
 * @param enemies Group of enemies
 * @param player Game object representing the player
 * @param enemyBullets Group of enemy bullet objects.
 */
let ai = (game, enemies, player, enemyBullets) => {
    enemies.map(enemy => {
        enemy.rotation = enemy.position.angle(player.position);

        let normalToPlayer = Phaser.Point
            .subtract(player.position, enemy.position)
            .normalize();

        accelerate(enemy, normalToPlayer, constants.ENEMY_ACCELERATION);
        capSpeed(enemy, constants.ENEMY_SPEED_MAX);

        if (enemy.position.distance(player.position) < constants.ENEMY_FIRE_RANGE) {
            fireWeapon(enemy, normalToPlayer, enemyBullets, game.time.now);
        }
    });
};

export {ai}