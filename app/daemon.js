/**
 * The daemon object is responsible for the creation and maintenance and fulfilment
 * of game related activities.  As this is used in conjunction with the Phaser library,
 * it must expose functions that can be called by the create and update methods of the
 * Phaser.Game object.
 */

import * as constants from './constants'
import _ from 'lodash'
import {handleUserInput} from './input'
import {createBullet, createPlayer, createEnemy} from './unit'
import {accelerate, capSpeed, fireWeapon} from './action'


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

    paintBlocks(game, getBlocksToPaint(game, player));
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
        let bullet = createBullet(game, 16, 0x00eeee);
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
    });

    enemyBullets = game.add.group();
    _.range(constants.ENEMY_BULLET_AMOUNT).map(()=> {
        let bullet = createBullet(game, 12, 0xff0000);
        bullet.kill();
        enemyBullets.add(bullet);
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

        accelerate(enemy, normalToPlayer, constants.ENEMY_ACCELERATION);
        capSpeed(enemy, constants.ENEMY_SPEED_MAX);

        if (enemy.position.distance(player.position) < constants.ENEMY_FIRE_RANGE) {
            fireWeapon(enemy, normalToPlayer, enemyBullets, game.time.now);
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
        enemy.c.lastFired = game.time.now;
    });
    enemyBullets.children.map(bullet => bullet.kill());
    playerBullets.children.map(bullet => bullet.kill());

};


// TODO Begin with the unit testing!
let worldBlocks = {};

let paintBlocks = (game, blocks) => {
    blocks.map(block => {
        worldBlocks[convertBlockToKey(block)] = true;

        let blockGraphics = game.add.graphics();

        //Draw stars
        _.range(game.rnd.integerInRange(5, 20)).map(()=> {
            blockGraphics.beginFill(0xffffff);
            blockGraphics.drawCircle(
                block.x * constants.WORLD_BLOCK_WIDTH + game.rnd.integerInRange(0, constants.WORLD_BLOCK_WIDTH),
                block.y * constants.WORLD_BLOCK_HEIGHT + game.rnd.integerInRange(0, constants.WORLD_BLOCK_HEIGHT),
                game.rnd.integerInRange(2, 9)
            );
            blockGraphics.endFill();
        });

        //Draw planets
        _.range(game.rnd.integerInRange(1, 4)).map(() => {
            blockGraphics.beginFill(Phaser.Color.getRandomColor(100));
            blockGraphics.drawCircle(
                block.x * constants.WORLD_BLOCK_WIDTH + game.rnd.integerInRange(0, constants.WORLD_BLOCK_WIDTH),
                block.y * constants.WORLD_BLOCK_HEIGHT + game.rnd.integerInRange(0, constants.WORLD_BLOCK_HEIGHT),
                game.rnd.integerInRange(80, 320));
            blockGraphics.endFill();
        });

        game.world.sendToBack(blockGraphics);

    });
};

let getBlocksToPaint = (game, player) => {
    let blocksToPaint = [];
    let currentBlock = getCurrentBlock(player);
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            let testBlock = {
                x: currentBlock.x + i,
                y: currentBlock.y + j
            };
            if (worldBlocks[convertBlockToKey(testBlock)] == null) {
                blocksToPaint.push(testBlock);
            }
        }
    }
    return blocksToPaint;
};

let getCurrentBlock = (unit) => {
    let x = Math.floor(unit.position.x / constants.WORLD_BLOCK_WIDTH);
    let y = Math.floor(unit.position.y / constants.WORLD_BLOCK_HEIGHT);
    return {x, y};
};

let convertBlockToKey = (block) => {
    return `${block.x},${block.y}`;
};

let convertKeyToBlock = (key) => {
    let [x, y] = key.split(',');
    x = parseInt(x, 10);
    y = parseInt(y, 10);
    return {x, y};
};