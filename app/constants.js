/**
 * Contants.js  Collection of game constants
 */

export const GAME_WIDTH = 640;
export const GAME_HEIGHT = 480;

export const DIAGONAL_MOVEMENT_MULTIPLIER = Math.sqrt(0.5);

export const PLAYER_ACCELERATION = 300;
export const PLAYER_SPEED_MAX = 500; // TODO : Maybe this should be a variable defined somewhere else?  That way we can allow for speedups and the like.
export const PLAYER_FIRE_RATE = 80;
export const PLAYER_BULLET_SPEED = 800;
export const PLAYER_BULLET_AMOUNT = 256;
export const PLAYER_BULLET_TIME_TO_LIVE = Phaser.Timer.SECOND * 20;
export const PLAYER_SHIP_DIAMETER = 48;

export const ENEMY_ACCELLERATION = 800;
export const ENEMY_SPEED_MAX = 800;
export const ENEMY_AMOUNT_MAX = 64;
export const ENEMY_BULLET_AMOUNT = 1024;
export const ENEMY_BULLET_SPEED = 400;
export const ENEMY_BULLET_TIME_TO_LIVE = Phaser.Timer.SECOND * 20;
export const ENEMY_FIRE_RANGE = 300;
export const ENEMY_FIRE_RATE = 1000;
export const ENEMY_SHIP_DIAMETER = 32;
