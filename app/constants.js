/**
 * Contants.js  Collection of game constants
 */

export const GAME_WIDTH = 640;
export const GAME_HEIGHT = 480;

export const PLAYER_ACCELERATION = 1000;
export const PLAYER_SPEED_MAX = 500;
export const PLAYER_FIRE_RATE = 185;
export const PLAYER_BULLET_SPEED = 800;
export const PLAYER_BULLET_AMOUNT = 256;
export const PLAYER_BULLET_DIAMETER = 16;
export const PLAYER_BULLET_TIME_TO_LIVE = Phaser.Timer.SECOND * 20;
export const PLAYER_SHIP_DIAMETER = 48;
export const PLAYER_SHIP_BASE_COLOR = 0x00eeee;

export const ENEMY_ACCELERATION = 2000;
export const ENEMY_SPEED_MAX = 400;
export const ENEMY_AMOUNT_MAX = 64;
export const ENEMY_BULLET_AMOUNT = 1024;
export const ENEMY_BULLET_SPEED = 200;
export const ENEMY_BULLET_DIAMETER = 12;
export const ENEMY_BULLET_TIME_TO_LIVE = Phaser.Timer.SECOND * 20;
export const ENEMY_FIRE_RANGE = 300;
export const ENEMY_FIRE_RATE = 1000;
export const ENEMY_SHIP_DIAMETER = 32;
export const ENEMY_SPAWN_RATE = 1000;
export const ENEMY_SHIP_BASE_COLOR = 0xff0000;

export const WORLD_BLOCK_WIDTH = 1000;
export const WORLD_BLOCK_HEIGHT = 1000;

export const INDICATOR_RADIUS = (Math.max(GAME_WIDTH, GAME_HEIGHT) / 2) - 115;

export const ZERO_VECTOR = new Phaser.Point(0, 0);