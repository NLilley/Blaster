/**
 * The daemon object is responsible for the creation and maintenance and fulfilment
 * of game related activities.  As this is used in conjunction with the Phaser library,
 * it must expose functions that can be called by the create and update methods of the
 * Phaser.Game object.
 */

import * as constants from './constants'
import _ from 'lodash'
import {handleUserInput} from './input'
import {createPlayer, createEnemy} from './unit'

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
 *  Create callback used to initialize Phaser game.  This will set up
 *  all of the required state to start the game.
 * @param {Phaser.Game} game The game object which we wish to initialize
 */
function create(game) {
    initializeGameSystems(game);
    initializeInput(game);
    initializeStateVariables(game);
    initializeTextObjects(game, playerScore);
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
        state(game, aliveEnemies);
        ai(game, aliveEnemies);
        physics(game);

    } else {
        aliveEnemies.map(enemy => {
            enemy.body.velocity.set(0, 0);
            enemy.body.acceleration.set(0, 0)
        });
        if (input.space.isDown) {
            resetGame(game);
        }
    }
    playerScoreText.text = `Score: ${playerScore}`;
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

let initializeTextObjects = (game, playerScore) => {

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

    let playerShip = game.add.graphics();
    playerShip.lineStyle(3, 0xffffff, 1);
    playerShip.beginFill(0x00eeee, 1);
    playerShip.drawCircle(0, 0, constants.PLAYER_SHIP_DIAMETER);
    player.addChild(playerShip);

    let playerGun = game.add.graphics();
    playerGun.beginFill(0xffffff, 1);
    playerGun.drawRect(12, -4, 24, 8);
    player.addChild(playerGun);

    playerBullets = game.add.group();
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
};

let initializeEnemyObjects = game => {
    enemies = game.add.group();
    _.range(constants.ENEMY_AMOUNT_MAX).map(()=> {
        let enemy = game.add.sprite(0, 0, null, 0, enemies);

        game.physics.arcade.enable(enemy);
        enemy.lastFired = 0; // TODO Also storing fire information on a sprite.  Abstract this out!

        let enemyGraphic = game.add.graphics();
        enemyGraphic.lineStyle(2, 0xffffff, 1);
        enemyGraphic.beginFill(0xff0000, 1);
        enemyGraphic.drawCircle(0, 0, constants.ENEMY_SHIP_DIAMETER);

        let enemyGraphicGun = game.add.graphics();
        enemyGraphicGun.beginFill(0xffffff, 1);
        enemyGraphicGun.drawRect(constants.ENEMY_SHIP_DIAMETER * 0.333, -3, constants.ENEMY_SHIP_DIAMETER * 0.5, 6)

        enemy.addChild(enemyGraphic);
        enemy.addChild(enemyGraphicGun);

        enemy.kill();
    });

    enemyBullets = game.add.group();
    _.range(constants.ENEMY_BULLET_AMOUNT).map(()=> {
        let bullet = game.add.sprite(0, 0, null, 0, enemyBullets);
        game.physics.arcade.enable(bullet);

        let bulletGraphic = game.add.graphics();
        bulletGraphic.lineStyle(1, 0xffffff, 1);
        bulletGraphic.beginFill(0xff0000, 1);
        bulletGraphic.drawCircle(0, 0, 12);
        bullet.addChild(bulletGraphic);

        bullet.kill();
    });
};

{
    let lastTimeEnemyAdded = 0;
    var state = (game, aliveEnemies) => {
        if (aliveEnemies.length < constants.ENEMY_AMOUNT_MAX &&
            game.time.now - lastTimeEnemyAdded > constants.ENEMY_SPAWN_RATE) {
            let enemyToReset = enemies.children.find(enemy => !enemy.alive);
            let spawnPoint = new Phaser.Point(500, 0);
            spawnPoint.rotate(0, 0, game.rnd.integerInRange(0, 360), true);
            enemyToReset.reset(player.x + spawnPoint.x, player.y + spawnPoint.y);
            lastTimeEnemyAdded = game.time.now;
        }
    };
}

let ai = (game, enemies) => {
    enemies.map(enemy => {
        enemy.rotation = enemy.position.angle(player.position);

        let normalToPlayer = Phaser.Point
            .subtract(player.position, enemy.position)
            .normalize();

        enemy.body.acceleration = normalToPlayer
            .clone()
            .multiply(constants.ENEMY_ACCELERATION, constants.ENEMY_ACCELERATION);

        if (enemy.body.velocity.getMagnitude() > constants.ENEMY_SPEED_MAX) {
            enemy.body.velocity.setMagnitude(constants.ENEMY_SPEED_MAX);
        }

        if (enemy.position.distance(player.position) < constants.ENEMY_FIRE_RANGE &&
            game.time.now - enemy.lastFired > constants.ENEMY_FIRE_RATE) {
            let bullet = enemyBullets.children.find(bullet => !bullet.alive);
            if (bullet != null) {
                bullet.reset(enemy.position.x, enemy.position.y);
                bullet.body.velocity = normalToPlayer
                    .clone()
                    .multiply(constants.ENEMY_BULLET_SPEED, constants.ENEMY_BULLET_SPEED)
                    .add(player.body.velocity.x, player.body.velocity.y);
                bullet.lifespan = constants.ENEMY_BULLET_TIME_TO_LIVE;
                enemy.lastFired = game.time.now;
            }
        }
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
        enemy.lastFired = game.time.now;
    });
    enemyBullets.children.map(bullet => bullet.kill());
    playerBullets.children.map(bullet => bullet.kill());

};
