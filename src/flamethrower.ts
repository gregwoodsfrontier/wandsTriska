import { EngineObject, Vector2, vec2, rand, min, keyIsDown, timeDelta, drawRect, rgb } from "littlejsengine";
import Fireball from "./fireball";
import { SE } from "./effects";

/**
 * Flamethrower class that spawns the Fireball object.
 * @param {Vector2} _pos Position of the flamethrower
 * @param {EngineObject} _parent Parent EngineObject that this flamethower attach to
 * @param {number} _cdPeriod Cooldown period for each spawn
 */
export default class FT extends EngineObject {
    constructor(_pos: Vector2, _parent: EngineObject) {
        super(_pos)
        _parent.addChild(this, vec2(0.5, 0))

        // weapon settings
        this.fireRate      = 8;
        this.bulletSpeed   = .5;
        this.bulletSpread  = .1;
        this.damage        = 1;
        this.fireTBuf = 0

        this.renderOrder = _parent.renderOrder + 1
    }

    fireRate: number
    bulletSpeed: number
    bulletSpread: number
    damage: number
    fireTBuf: number // fire time buffer

    update() {
        this.posUpdate()
        this.fireTBuf += timeDelta

        if(keyIsDown("KeyC")) {
            for(; this.fireTBuf > 0; this.fireTBuf -= 1/this.fireRate)
                this.spawnFire()
        } else {
            this.fireTBuf = min(this.fireTBuf, 0)
        }

        super.update()
    }

    posUpdate() {
        this.mirror = this.parent.mirror
    }

    render(): void {
        drawRect(this.pos, vec2(0.4, 0.4), rgb(1, 1, 0, 0))
    }

    spawnFire() {
        SE.SHOOT.play(this.pos)
        this.localAngle = -rand(.2,.25);
        const direction = vec2(this.bulletSpeed*this.getMirrorSign(), 0);
        const velocity = direction.rotate(rand(-1,1)*this.bulletSpread);
        new Fireball(this.pos, velocity)
    }

}