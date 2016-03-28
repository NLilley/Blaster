import * as constants from './constants';
import {getNormalizedMouseVector, getMouseRotation} from './math'

/**
 * Given a keys and the game object, respond to user input.
 * @param {Object} input  An object filled with Phaser.js keys that can be checked to determine user input
 * @param {Phaser.Game} game  A Phaser game object
 */
let handleUserInput = (input, game) => {
    if(!game.stash.player.alive) return;
    handlePlayerMovement(input.cursors, game.stash.player);
    rotatePlayerToMouse(input.mouse, game.stash.player);
    handlePlayerFire(game.time, input.mouse, game.stash.player, game.stash.playerBullets);
};

/**
 * Move the player in the game world in response to user keys.
 * @param cursors  The Phaser keyboard input representing up, down, left and right.
 * @param player  The sprite object representing the player
 */
let handlePlayerMovement = (cursors, player) => {
    // TODO Use accessleration instead of velocity!

    let x = 0;
    let y = 0;

    if (cursors.up.isDown || cursors.w.isDown) y--;
    if (cursors.down.isDown || cursors.s.isDown) y++;
    if (cursors.left.isDown || cursors.a.isDown) x--;
    if (cursors.right.isDown || cursors.d.isDown) x++;

    if (Math.abs(x) + Math.abs(y) == 2) {
        player.body.acceleration.set(
            x * constants.DIAGONAL_MOVEMENT_MULTIPLIER * constants.PLAYER_ACCELERATION,
            y * constants.DIAGONAL_MOVEMENT_MULTIPLIER * constants.PLAYER_ACCELERATION
        );
    } else {
        player.body.acceleration.set(
            x * constants.PLAYER_ACCELERATION,
            y * constants.PLAYER_ACCELERATION
        );
    }

    let speed = player.body.velocity.getMagnitude();
    if (speed > constants.PLAYER_SPEED_MAX) {
        player.body.velocity.setMagnitude(constants.PLAYER_SPEED_MAX);
    }
};

/**
 * Get the mouses rotation away from the baseline vector (1,0) and rotate the player graphic to that point.
 * @param mouse
 * @param player
 */
let rotatePlayerToMouse = (mouse, player) => {
    // *-1 because of Phaser's backwards rotations?
    player.rotation = getMouseRotation(mouse.x, mouse.y) * - 1;
};

{
    let lastPlayerFire = 0;
    let cleanUpBullet = bullet => {
        bullet.kill();
    };

    var handlePlayerFire = (time, mouse, player, playerBullets) => {
        let currentTime = time.now;

        if (mouse.isUp) return;
        if (currentTime - lastPlayerFire <= constants.PLAYER_FIRE_RATE) return;

        let bullet = playerBullets.children.find(bullet => !bullet.alive);
        if (bullet == null) return;

        let vec = getNormalizedMouseVector(mouse.x, mouse.y);

        bullet.reset(
            vec.x * constants.PLAYER_SHIP_DIAMETER / 2 * player.scale.x + player.body.x,
            vec.y * -1 * constants.PLAYER_SHIP_DIAMETER / 2 * player.scale.y + player.body.y
        );

        bullet.body.velocity.x = player.body.velocity.x + constants.PLAYER_BULLET_SPEED * vec.x;
        bullet.body.velocity.y = player.body.velocity.y + constants.PLAYER_BULLET_SPEED * vec.y * -1;

        // TODO Maybe clean up bullets in update loop instead?  Will need to track created time though!
        time.events.add(constants.PLAYER_BULLET_TIME_TO_LIVE, cleanUpBullet, null, bullet);
        lastPlayerFire = currentTime;

    };
}

export {handleUserInput}