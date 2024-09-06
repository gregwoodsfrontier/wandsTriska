import { EngineObject, Vector2, vec2, tile, Timer, randInt } from "littlejsengine";
import { TILEMAP_LOOKUP } from "./level";
import { makeDeb, PALLETE } from "./effects";
import Fireball from "./fireball";

export default class Flamethrower extends EngineObject {
    constructor(_parent: EngineObject, _cdPeriod: number) {
        const offsetVec = _parent.mirror ? vec2(-0.5, 0) : vec2(0.5, 0)
        super(_parent.pos.add(offsetVec))
        this.parent = _parent
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
        const offsetVec = this.parent.mirror ? vec2(-0.5, 0) : vec2(0.5, 0)
        this.pos = (this.parent as EngineObject).pos.copy().add(offsetVec)
    }

    spawnFire() {
        if((this.parent as EngineObject).mirror) {
            new Fireball(this.pos).velocity = vec2(-1, randInt(-3, 3)).normalize(3)
        } else {
            new Fireball(this.pos).velocity = vec2(1, randInt(-3, 3)).normalize(3)
        }
    }

}