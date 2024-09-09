import { EngineObject, Vector2, vec2, tile } from "littlejsengine";
import { TILEMAP_LOOKUP } from "./level";
import { makeDeb, PALLETE } from "./effects";

export default class Fireball extends EngineObject {
    constructor(_pos: Vector2, _vel: Vector2) {
        super(_pos, vec2(0.5, 0.5), tile(TILEMAP_LOOKUP.FIRE-1))
        this.velocity = _vel
        this.setCollision(true, false)
    }

    kill() {
        this.destroy()
        makeDeb(this.pos, PALLETE.WHITE, 5)
    }

    collideWithTile(_tile: number): boolean {
        if(_tile < 1) return false
        this.kill()
        return true
    }

    collideWithObject(obj: EngineObject): boolean {
        this.kill()
        obj.applyForce(this.velocity.normalize(.1))
        return true
    }

}