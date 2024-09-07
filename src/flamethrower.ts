import { EngineObject, Vector2, vec2, Timer, randInt, drawRect, rgb, ParticleEmitter, tile, rand } from "littlejsengine";
import Fireball from "./fireball";
import { TILEMAP_LOOKUP } from "./level";
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

        this.shellEmitter = new ParticleEmitter(
            vec2(), 0, 0, 0, 0, .1,  // pos, angle, emitSize, emitTime, emitRate, emiteCone
            tile(TILEMAP_LOOKUP.FIRE),                       // tileInfo
            rgb(1,.8,.5), rgb(.9,.7,.5), // colorStartA, colorStartB
            rgb(1,.8,.5), rgb(.9,.7,.5), // colorEndA, colorEndB
            3, .1, .1, .15, .1, // time, sizeStart, sizeEnd, speed, angleSpeed
            1, .95, 1, 0, 0,    // damp, angleDamp, gravity, particleCone, fade
            .1, true               // randomness, collide, additive, colorLinear, renderOrder
        )

        this.renderOrder = _parent.renderOrder + 1
    }

    fireRate: number
    bulletSpeed: number
    bulletSpread: number
    damage: number
    fireTBuf: number // fire time buffer
    shellEmitter: ParticleEmitter

    update() {
        this.posUpdate()
        super.update()
    }

    posUpdate() {
        this.mirror = this.parent.mirror
    }

    render(): void {
        drawRect(this.pos, vec2(0.4, 0.4), rgb(1, 1, 0, 0.5))
    }

    spawnFire() {
        SE.SHOOT.play(this.pos)
        this.localAngle = -rand(.2,.25);
        const direction = vec2(this.bulletSpeed*this.getMirrorSign(), 0);
        const velocity = direction.rotate(rand(-1,1)*this.bulletSpread);
        new Fireball(this.pos, velocity)
    }

}