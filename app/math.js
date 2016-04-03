/**
 * Math.js Reusable mathematical functions for performing game calculations
 */

import * as constants from './constants'


let getNormalizedMouseVector = (x, y)=> {
    return new Phaser.Point(
        x - constants.GAME_WIDTH / 2,
        (y - constants.GAME_HEIGHT / 2)
    ).normalize();
};

{
    let baselineVector = new Phaser.Point(0, 0);
    var getMouseRotation = (x, y) => {
        let vec = getNormalizedMouseVector(x, y);
        return baselineVector.angle(vec);
    };
}

let getBulletVelocity = (target, shooter, bulletSpeed) => {

};

/**
 * Check if the target is within the camera specified.
 * @param target Target to check
 * @param camera The camera
 */
let inCamera = (target, camera) => {
    if (target.position.x >= camera.x &&
        target.position.x <= camera.x + camera.width &&
        target.position.y >= camera.y &&
        target.position.y <= camera.y + camera.height) {
        return true;
    }
    return false;
};

export {getMouseRotation, getNormalizedMouseVector, inCamera}
