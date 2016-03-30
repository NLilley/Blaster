/**
 * Code relating to the creation and maintenance of game units such as the player and enemies..
 */
import * as constants from './constants'


let createEnemy = (game) => {
};

let createPlayer = (game) => {
    let player = game.add.sprite(0,0);
    game.physics.enable(player);
    game.camera.follow(player);
    player.addChild(createShipGraphic(game, 0x00eeee, constants.PLAYER_SHIP_DIAMETER));
    return player;
};

let createShipGraphic = (game, color, diameter) => {
    let lineWidth = diameter > 32 ? 3 : 2;
    let ship = game.add.graphics();
    ship.lineStyle(lineWidth, 0xffffff, 1);
    ship.beginFill(color, 1);
    ship.drawCircle(0, 0, diameter);

    let gunWidth = diameter / 6;
    let shipGun = game.add.graphics();
    shipGun.beginFill(0xffffff, 1);
    shipGun.drawRect(diameter / 3, -1 * gunWidth / 2, diameter / 3, gunWidth);
    ship.addChild(shipGun);

    return ship;
};

export {createPlayer, createEnemy}