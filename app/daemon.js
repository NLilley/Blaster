/**
 * The daemon object is responsible for the creation and maintenance and fulfilment
 * of game related activities.  As this is used in conjunction with the Phaser library,
 * it must expose functions that can be called by the create and update methods of the
 * Phaser.Game object.
 */

import * as constants from './constants'
import _ from 'lodash'
import {handleUserInput} from './input'
import {createBullet, createPlayer, createEnemy, createIndicator} from './unit'
import {accelerate, capSpeed, fireWeapon} from './action'
import {ai} from './ai'
import {paintWorld} from './world'
import {state} from './state'


export {create, update};

let playerScore;

let playerScoreText;
let gameOverText;
let resetText;

let enemies;
let enemyBullets;

let player;
let playerBullets;

let input;

/**
 * Create callback used to initialize Phaser game.  This will set up
 * all of the required state to start the game.
 * @param {Phaser.Game} game The game object which we wish to initialize
 */
function create(game) {
    game.stage.backgroundColor = '#0c0020';
    initializeGameSystems(game);
    initializeInput(game);
    initializeStateVariables(game);
    initializeTextObjects(game);
    initializePlayerObjects(game);
    initializeEnemyObjects(game);
}

/**
 * Update function called by the Phaser.Game object to perform game logic.
 * This function is the main means of controlling the state of the game after the
 * create function has initialized the game for us.
 * @param {Phaser.Game} game Phaser game object
 */
function update(game) {
    let aliveEnemies = enemies.children.filter(enemy => enemy.alive);

    if (player.alive) {
        handleUserInput(input, game, player, playerBullets);
        state(game, aliveEnemies, enemies, player);
        ai(game, aliveEnemies, player, enemyBullets);
        physics(game);
        paintWorld(game, player);
        playerScoreText.text = `Score: ${playerScore}`;

    } else {
        aliveEnemies.map(enemy => {
            enemy.body.velocity.set(0, 0);
            enemy.body.acceleration.set(0, 0)
        });
        if (input.space.isDown) {
            resetGame(game);
        }
    }
}

let initializeGameSystems = game => {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.camera.bounds = null;
    game.renderer.renderSession.roundPixels = true;
};

let initializeInput = game => {
    input = {};
    input.cursors = game.input.keyboard.createCursorKeys();
    input.cursors.w = game.input.keyboard.addKey(Phaser.Keyboard.W);
    input.cursors.a = game.input.keyboard.addKey(Phaser.Keyboard.A);
    input.cursors.s = game.input.keyboard.addKey(Phaser.Keyboard.S);
    input.cursors.d = game.input.keyboard.addKey(Phaser.Keyboard.D);
    input.mouse = game.input.mousePointer;
    input.space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
};

let initializeStateVariables = game => {
    playerScore = 0;
};

let initializeTextObjects = (game) => {
    playerScoreText = game.add.text(10, 10, '', {
        fill: 'white',
        font: '24px Arial'
    });
    playerScoreText.fixedToCamera = true;

    gameOverText = game.add.text(constants.GAME_WIDTH / 2, constants.GAME_HEIGHT / 2, 'GAME OVER!', {
        fill: 'white',
        font: '72px Arial'
    });
    gameOverText.anchor.set(0.5);
    gameOverText.fixedToCamera = true;
    gameOverText.kill();

    resetText = game.add.text(constants.GAME_WIDTH / 2, constants.GAME_HEIGHT - 20,
        'Press space to restart!',
        {
            fill: 'white',
            font: '24px Arial'
        });
    resetText.anchor.set(0.5);
    resetText.fixedToCamera = true;
    resetText.kill();
};

let initializePlayerObjects = game => {
    player = createPlayer(game);
    game.camera.follow(player);

    playerBullets = game.add.group();

    _.range(constants.PLAYER_BULLET_AMOUNT).map(() => {
        let bullet = createBullet(game, 16, constants.PLAYER_SHIP_BASE_COLOR);
        bullet.kill();
        playerBullets.add(bullet);
    });
};

let initializeEnemyObjects = game => {
    enemies = game.add.group();
    _.range(constants.ENEMY_AMOUNT_MAX).map(()=> {
        let enemy = createEnemy(game);
        enemy.kill();
        enemies.add(enemy);

        let indicator = createIndicator(game, constants.ENEMY_SHIP_BASE_COLOR);
        indicator.kill();

        enemy.c.indicator = indicator;
    });

    enemyBullets = game.add.group();
    _.range(constants.ENEMY_BULLET_AMOUNT).map(()=> {
        let bullet = createBullet(game, 12, constants.ENEMY_SHIP_BASE_COLOR);
        bullet.kill();
        enemyBullets.add(bullet);
    });
};

let physics = game => {
    let gameOver = () => {
        gameOverText.reset();
        resetText.reset();
    };

    game.physics.arcade.collide(playerBullets, enemies, (bullet, enemy) => {
        bullet.kill();
        enemy.kill();
        playerScore += 1;
    });

    game.physics.arcade.collide(player, enemies, (player, enemy) => {
        player.kill();
        enemy.kill();
        gameOver();
    });

    game.physics.arcade.collide(player, enemyBullets, (player, bullet) => {
        player.kill();
        bullet.kill();
        gameOver();
    });

    game.physics.arcade.collide(playerBullets, enemyBullets, (playerBullet, enemyBullet) => {
        playerBullet.kill();
        enemyBullet.kill();
    });
};

let resetGame = game => {
    gameOverText.kill();
    resetText.kill();
    player.reset(0, 0);
    playerScore = 0;
    enemies.children.map(enemy => {
        enemy.kill();
        enemy.c.lastFired = game.time.now;
    });
    enemyBullets.children.map(bullet => bullet.kill());
    playerBullets.children.map(bullet => bullet.kill());

};