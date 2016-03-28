/*
 Nicholas Lilley @ 2016
 Please forgive the horrendous graphics!
 */

import _ from 'lodash';

import {handleUserInput} from './input'
import * as constants from './constants'

const gameWidth = 640;
const gameHeight = 480;
let appDOMElement = document.querySelector('.app');

// TODO We currently bind this to the game object.  Find a better solution than this!
let stash = {};

new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, appDOMElement, {
    preload: preload,
    create: create,
    update: update
}, null, true);


function preload(game) {
}

function create(game) {

    game.add.text(0, 0, 'Placeholder Text!', {fill: 'white'});
    //game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
    //game.input.onDown.add(()=> {
    //    (game.scale.isFullScreen) ? game.scale.stopFullScreen() : game.scale.startFullScreen(false);
    //});

    // Setup Game
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.camera.bounds = null;
    game.renderer.renderSession.roundPixels = true;
    game.stash = stash; // TODO Storing our own objects on the global game obje3ct

    //Setup Input
    let input = {};
    input.cursors = game.input.keyboard.createCursorKeys();
    input.cursors.w = game.input.keyboard.addKey(Phaser.Keyboard.W);
    input.cursors.a = game.input.keyboard.addKey(Phaser.Keyboard.A);
    input.cursors.s = game.input.keyboard.addKey(Phaser.Keyboard.S);
    input.cursors.d = game.input.keyboard.addKey(Phaser.Keyboard.D);
    input.mouse = game.input.mousePointer;
    input.space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    game.stash.input = input; // TODO Adding to stash!

    // Create player sprite
    let player = game.add.sprite(constants.GAME_WIDTH / 2, constants.GAME_HEIGHT / 2);
    game.physics.enable(player);

    let playerShip = game.add.graphics();
    playerShip.lineStyle(3, 0xffffff, 1);
    playerShip.beginFill(0x00eeee, 1);
    playerShip.drawCircle(0, 0, constants.PLAYER_SHIP_DIAMETER);
    player.addChild(playerShip);

    let playerGun = game.add.graphics();
    playerGun.beginFill(0xffffff, 1);
    playerGun.drawRect(12, -4, 24, 8);
    player.addChild(playerGun);

    game.stash.player = player; // TODO Adding to stash!

    let playerBullets = game.add.group();
    _.range(constants.PLAYER_BULLET_AMOUNT).map(() => {
        let bullet = game.add.sprite(0, 0, null, 0, playerBullets);
        game.physics.arcade.enable(bullet);

        let bulletGraphic = game.add.graphics();
        bulletGraphic.lineStyle(1, 0xffffff, 1);
        bulletGraphic.beginFill(0x00eeee, 1);
        bulletGraphic.drawCircle(0, 0, 16);
        bullet.addChild(bulletGraphic);

        bullet.kill();
    });

    game.stash.playerBullets = playerBullets; // TODO Adding to stash!


    let enemies = game.add.group();
    _.range(constants.ENEMY_AMOUNT_MAX).map(()=> {
        let enemy = game.add.sprite(0, 0, null, 0, enemies);
        game.physics.arcade.enable(enemy);

        let enemyGraphic = game.add.graphics();
        enemyGraphic.lineStyle(2, 0xffffff, 1);
        enemyGraphic.beginFill(0xff0000, 1);
        enemyGraphic.drawCircle(0, 0, constants.ENEMY_SHIP_DIAMETER);

        let enemyGraphicGun = game.add.graphics();
        enemyGraphicGun.beginFill(0xffffff, 1);
        enemyGraphicGun.drawRect(constants.ENEMY_SHIP_DIAMETER * 0.333, -3, constants.ENEMY_SHIP_DIAMETER * 0.5, 6)

        enemy.addChild(enemyGraphic);
        enemy.addChild(enemyGraphicGun);

        //enemy.kill();
    });

    game.stash.enemies = enemies; //TODO Adding to stash!

    let enemyBullets = game.add.group();
    _.range(constants.ENEMY_BULLET_AMOUNT).map(()=> {
        let bullet = game.add.sprite(0, 0, null, 0, playerBullets);
        game.physics.arcade.enable(bullet);

        let bulletGraphic = game.add.graphics();
        bulletGraphic.lineStyle(1, 0xffffff, 1);
        bulletGraphic.beginFill(0xff0000, 1);
        bulletGraphic.drawCircle(0, 0, 12);
        bullet.addChild(bulletGraphic);

        bullet.kill();
    });

    game.stash.enemyBullets = enemyBullets; // TODO Adding to stash!


    game.camera.follow(player);
}

function update(game) {
    handleUserInput(game.stash.input, game);

    game.physics.arcade.collide(game.stash.playerBullets, game.stash.enemies, (bullet, enemy) => {
        console.log('I have been hit!');
        bullet.kill();
        enemy.kill();
    });
}

