import constants from './constants'

let getNormalizedMouseVector = (x, y)=> {
    return new Phaser.Point(
        x - constants.GAME_WIDTH / 2,
        (y - constants.GAME_HEIGHT / 2) * -1
    ).normalize();
};

let getMouseRotation = (x, y) => {
    let vec = getNormalizedMouseVector(x, y);
    let angle = Math.asin(vec.y);
    if (vec.x < 0) {
        angle = Math.PI - angle;
    }

    return angle;
};

export {getMouseRotation, getNormalizedMouseVector}