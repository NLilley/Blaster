/**
 * Contants.js  Collection of game constants
 */

let constants = {};


const GAME_WIDTH = 640;
const GAME_HEIGHT = 480;

const DIAGONAL_MOVEMENT_MULTIPLIER = Math.sqrt(0.5);

const PLAYER_SPEED_MAX = 500; // TODO : Maybe this should be a variable defined somewhere else?  That way we can allow for speedups and the like.
const PLAYER_FIRE_RATE = 80;
const PLAYER_BULLET_SPEED = 800;
const PLAYER_BULLET_AMOUNT = 256;
const PLAYER_BULLET_TIME_TO_LIVE = Phaser.Timer.SECOND * 20;
const PLAYER_SHIP_DIAMETER = 48;

constants.GAME_WIDTH = GAME_WIDTH;
constants.GAME_HEIGHT = GAME_HEIGHT;
constants.DIAGONAL_MOVEMENT_MULTIPLIER = DIAGONAL_MOVEMENT_MULTIPLIER;

constants.PLAYER_SPEED_MAX = PLAYER_SPEED_MAX;
constants.PLAYER_FIRE_RATE = PLAYER_FIRE_RATE;
constants.PLAYER_BULLET_SPEED = PLAYER_BULLET_SPEED;
constants.PLAYER_BULLET_AMOUNT = PLAYER_BULLET_AMOUNT;
constants.PLAYER_BULLET_TIME_TO_LIVE = PLAYER_BULLET_TIME_TO_LIVE;
constants.PLAYER_SHIP_DIAMETER = PLAYER_SHIP_DIAMETER;


export default constants;