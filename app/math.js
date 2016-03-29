import * as constants from './constants'

let getNormalizedMouseVector = (x, y)=> {
    return new Phaser.Point(
        x - constants.GAME_WIDTH / 2,
        (y - constants.GAME_HEIGHT / 2) * -1
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

export {getMouseRotation, getNormalizedMouseVector}