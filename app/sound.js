/**
 * Sound.js Load and prepare sound for use in the game
 */
let loadSound = game => {
    game.load.audio('background', './assets/audio/Cyborg Ninja.mp3');
    game.load.audio('explosion', './assets/audio/Explosion.wav');
    game.load.audio('shoot', './assets/audio/Shoot.wav',true);
};

let initializeSound = game => {
    shootSFX = game.add.audio('shoot');
    explosionSFX = game.add.audio('explosion');
    backgroundMusic = game.add.audio('background');
    backgroundMusic.play();
};

export let shootSFX;
export let explosionSFX;
export let backgroundMusic;

export {loadSound, initializeSound}