import constants from './constants';

/**
 * Given a keys and the game object, respond to user input.
 * @param {Object} input  An object filled with Phaser.js keys that can be checked to determine user input
 * @param {Phaser.Game} game  A Phaser game object
 */
let handleUserInput = (input, game) => {
    handlePlayerMovement(input.cursors, game.stash.player);
    rotatePlayerToMouse(input.mouse, game.stash.player);
    handlePlayerFire(game.time.now, input.mouse, game.stash.player, game.stash.playerBullets);
};

/**
 * Move the player in the game world in response to user keys.
 * @param cursors  The Phaser keyboard input representing up, down, left and right.
 * @param player  The sprite object representing the player
 */
let handlePlayerMovement = (cursors, player) => {
    let x = 0;
    let y = 0;

    if (cursors.up.isDown || cursors.w.isDown) y--;
    if (cursors.down.isDown || cursors.s.isDown) y++;
    if (cursors.left.isDown || cursors.a.isDown) x--;
    if (cursors.right.isDown || cursors.d.isDown) x++;

    if (Math.abs(x) + Math.abs(y) == 2) {
        player.body.velocity.x = x * constants.DIAGONAL_MOVEMENT_MULTIPLIER * constants.PLAYER_SPEED;
        player.body.velocity.y = y * constants.DIAGONAL_MOVEMENT_MULTIPLIER * constants.PLAYER_SPEED;
    } else {
        player.body.velocity.x = x * constants.PLAYER_SPEED;
        player.body.velocity.y = y * constants.PLAYER_SPEED;
    }
};

let getNormalizedMouseVector = (x, y)=> {
    return new Phaser.Point(
        x - constants.GAME_WIDTH / 2,
        (y - constants.GAME_HEIGHT / 2) * -1
    ).normalize();
};

let getMouseRoationFromBaseInDegrees = (x, y) => {
    let vec = getNormalizedMouseVector(x, y);
    let angle = Math.asin(vec.y);
    if (vec.x < 0) {
        angle = Math.PI - angle;
    }

    return angle;

};

let rotatePlayerToMouse = (mouse, player) => {
    // *-1 because of Phaser's backwards rotations?
    player.rotation = getMouseRoationFromBaseInDegrees(mouse.x, mouse.y) * -1;
};

let lastPlayerFire = 0;
let handlePlayerFire = (currentTime, mouse, player, playerBullets) => {
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

    lastPlayerFire = currentTime;
};

export {handleUserInput}