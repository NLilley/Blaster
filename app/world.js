/**
 * World.js Functions defined here are responsible for creating the world that will be drawn forthe user.
 */

import * as constants from './constants'


let worldBlocks = {};

/**
 * Generate the world by drawing planets, stars, etc.
 * @param {Phaser.Game} game Game object
 * @param player The player game object
 */
let paintWorld = (game, player) => {
    let blocks = getBlocksToPaint(game, player);

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

/**
 * Get the world blocks that need to be painted.
 * These are the unpainted world blocks that neighbour the player.
 * @param {Phaser.Game} game Phaser game object
 * @param player Player game object
 * @returns {Array} An array of blocks to paint, objects {x,y}
 */
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

export{paintWorld};

