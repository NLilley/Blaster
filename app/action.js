/**
 * Code responsible for performing actions within the world, such as controlling motion,
 * firing weapons, etc.
 */

/**
 * Accelerate the unit in the direction specified by x and y.
 *
 * X and Y must form a unit vector.
 * @param unit  The unit to accelerate.  Must be a modified Phaser.Sprite
 * @param {Phaser.Point} direction Direction that the unit should accelerate in.  Must be a unit vector.
 * @param acceleration The amount of acceleration to apply.
 */
let accelerate = (unit, direction, acceleration) => {
    unit.body.acceleration.set(
        direction.x * acceleration,
        direction.y * acceleration
    )
};

/**
 * Prevent the unit from moving faster than maxSpeed.
 * This will remove acceleration on objects already travelling at maxSpeed.
 * @param unit
 * @param maxSpeed
 */
let capSpeed = (unit, maxSpeed) => {
    let speed = unit.body.velocity.getMagnitude();
    if (speed > maxSpeed) {
        unit.body.velocity.setMagnitude(maxSpeed);
    }
};


/**
 * Make the unit fire its weapon in the direction specified
 * @param unit Unit to fire its Weapon.  Must be modified Phaser.Sprite
 * @param {Phaser.Point} direction Direction in which to fire.  Must be a unit vector.
 * @param {Phaser.Group} bulletPool Pool from which to draw bullets.  If no bullet is available, do not fire.
 * @param currentTime The current time of the game world in milliseconds.
 */
let fireWeapon = (unit, direction, bulletPool, currentTime) => {
    if (currentTime - unit.c.weapon.lastFired <= unit.c.weapon.fireRate) return;

    let bullet = bulletPool.children.find(bullet => !bullet.alive);
    if (bullet == null) return;

    bullet.reset(
        unit.position.x + direction.x * unit.width * 0.5 * unit.scale.x,
        unit.position.y + direction.y * unit.height * 0.5 * unit.scale.y
    );

    bullet.body.velocity.set(
        unit.body.velocity.x + unit.c.weapon.bulletSpeed * direction.x,
        unit.body.velocity.y + unit.c.weapon.bulletSpeed * direction.y
    );

    bullet.lifespan = unit.c.weapon.bulletLifespan;
    unit.c.weapon.lastFired = currentTime;
};

export {accelerate, capSpeed, fireWeapon}