import _ from 'lodash';

import * as constants from './constants'
import {preload, create, update} from './daemon'

let appDOMElement = document.querySelector('.app');

new Phaser.Game(constants.GAME_WIDTH, constants.GAME_HEIGHT, Phaser.AUTO, appDOMElement, {
    preload: preload,
    create: create,
    update: update
}, null, true);

//Alter the Phaser.Group object to behave more like an array.
Phaser.Group.prototype.map = function map(fn) {
    return this.children.map(fn);
};

Phaser.Group.prototype.find = function find(fn) {
    return this.children.find(fn);
};

Phaser.Group.prototype.filter = function (fn) {
    return this.children.filter(fn);
};
