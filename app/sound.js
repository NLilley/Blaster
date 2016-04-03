/**
 * Sound.js Load and prepare sound for use in the game
 */
let loadSound = game => {
    game.load.audio('explosion', './assets/sfx/Explosion.wav');
    game.load.audio('shoot', './assets/sfx/Shoot.wav');
};

let initializeSound = game => {
    shootSFX = game.add.audio('shoot');
    explosionSFX = game.add.audio('explosion');
};

export let shootSFX;
export let explosionSFX;

export {loadSound, initializeSound}