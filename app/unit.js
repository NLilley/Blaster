/**
 * Code relating to the creation and maintenance of game units such as the player and enemies.
 * On all created units, we create the 'c' attribute for custom components, which is used for
 * tracking stats such as health outside of the main Phaser workflow.
 */
import * as constants from './constants'


let createPlayer = (game) => {
    let player = createShip(game, constants.PLAYER_SHIP_DIAMETER, 0x00eeee);
    // TODO Should these paraemters be stored on the weapons or the bullets?
    player.c.weapon.bulletSpeed = constants.PLAYER_BULLET_SPEED;
    player.c.weapon.bulletLifespan = constants.PLAYER_BULLET_TIME_TO_LIVE;
    player.c.weapon.fireRate = constants.PLAYER_FIRE_RATE;
    return player;
};

let createEnemy = (game) => {
    let enemy = createShip(game, constants.ENEMY_SHIP_DIAMETER, 0xff0000);
    enemy.c.weapon.bulletSpeed = constants.ENEMY_BULLET_SPEED;
    enemy.c.weapon.bulletLifespan = constants.ENEMY_BULLET_TIME_TO_LIVE;
    enemy.c.weapon.fireRate = constants.ENEMY_FIRE_RATE;
    return enemy;
};

let createShip = (game, diameter, color) => {
    let ship = game.add.sprite(0, 0);
    game.physics.enable(ship);
    ship.addChild(createShipGraphic(game, diameter, color));

    ship.c = {
        weapon: createWeapon(0, 0, 0)
    };
    return ship;
};

let createBullet = (game, diameter, color) => {
    let bullet = game.add.sprite(0, 0);
    game.physics.enable(bullet);
    bullet.addChild(createBulletGraphic(game, diameter, color));

    bullet.c = {};
    return bullet;
};

let createShipGraphic = (game, diameter, color) => {
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

let createBulletGraphic = (game, diameter, color) => {
    let lineWidth = diameter > 16 ? 2 : 1;

    let bullet = game.add.graphics();
    bullet.lineStyle(lineWidth, 0xffffff, 1);
    bullet.beginFill(color, 1);
    bullet.drawCircle(0, 0, diameter);
    bullet.endFill();

    return bullet;
};

let createWeapon = (bulletSpeed, bulletLifespan, fireRate) => {
    return {
        bulletSpeed: bulletSpeed,
        bulletLifespan: bulletLifespan,
        fireRate: fireRate,
        lastFired: 0
    }
};

let createIndicator = (game, color) => {
    let sprite = game.add.sprite(0, 0);
    let indicator = game.add.graphics();

    indicator.lineStyle(8, color, 0.6);
    indicator.moveTo(-14, -18);
    indicator.lineTo(14, 0);
    indicator.lineTo(-14, 18);

    sprite.addChild(indicator);
    return sprite;
};

export {createPlayer, createEnemy, createBullet, createIndicator}