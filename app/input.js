import * as constants from './constants';
import {getNormalizedMouseVector, getMouseRotation} from './math'
import {accelerate, capSpeed, fireWeapon} from './action'

/**
 * Given a keys and the game object, respond to user input.
 * @param {Object} input  An object filled with Phaser.js keys that can be checked to determine user input
 * @param {Phaser.Game} game  A Phaser game object
 * @param player The player game object
 * @param playerBullets The player bullets object
 */
let handleUserInput = (input, game, player, playerBullets) => {
    if (!player.alive) return;
    handlePlayerMovement(input.cursors, player);
    rotatePlayerToMouse(input.mouse, player);
    handlePlayerFire(game.time, input.mouse, player, playerBullets);
};

/**
 * Move the player in the game world in response to user keys.
 * @param cursors  The Phaser keyboard input representing up, down, left and right.
 * @param player  The sprite object representing the player
 */
let handlePlayerMovement = (cursors, player) => {
    let direction = new Phaser.Point(0, 0);

    if (cursors.up.isDown || cursors.w.isDown) direction.y--;
    if (cursors.down.isDown || cursors.s.isDown) direction.y++;
    if (cursors.left.isDown || cursors.a.isDown) direction.x--;
    if (cursors.right.isDown || cursors.d.isDown) direction.x++;

    direction.normalize();

    accelerate(player, direction, constants.PLAYER_ACCELERATION);
    capSpeed(player, constants.PLAYER_SPEED_MAX);
};

/**
 * Get the mouses rotation away from the baseline vector (1,0) and rotate the player graphic to that point.
 * @param mouse
 * @param player
 */
let rotatePlayerToMouse = (mouse, player) => {
    player.rotation = getMouseRotation(mouse.x, mouse.y);
};


let handlePlayerFire = (time, mouse, player, playerBullets) => {
    if (mouse.isUp) return;
    let vec = getNormalizedMouseVector(mouse.x, mouse.y);
    fireWeapon(player, vec, playerBullets, time.now);
};


export {handleUserInput}