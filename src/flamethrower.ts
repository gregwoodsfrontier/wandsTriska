import { EngineObject, Vector2, vec2, Timer, randInt, drawRect, rgb } from "littlejsengine";
import Fireball from "./fireball";

export default class Flamethrower extends EngineObject {
    constructor(_pos: Vector2, _cdPeriod: number) {
        super(_pos)
        this.cooldownTimer = new Timer()
        this.cdPeriod = _cdPeriod
    }

    cooldownTimer: Timer
    cdPeriod: number

    update() {
        this.posUpdate()
        super.update()
    }

    posUpdate() {
        this.localPos = (this.parent as EngineObject).mirror ? vec2(-0.5, 0) : vec2(0.5, 0)
    }

    render(): void {
        drawRect(this.localPos, vec2(0.4, 0.4), rgb(1, 1, 0, 0.5))
    }

    spawnFire() {
        if(this.cooldownTimer.active()) return

        if((this.parent as EngineObject).mirror) {
            new Fireball(this.pos).velocity = vec2(-1, randInt(-3, 3)).normalize(3)
        } else {
            new Fireball(this.pos).velocity = vec2(1, randInt(-3, 3)).normalize(3)
        }
        this.cooldownTimer.set(this.cdPeriod)
    }

}