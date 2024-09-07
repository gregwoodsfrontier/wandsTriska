import { EngineObject, Vector2, vec2, tile } from "littlejsengine";
import { TILEMAP_LOOKUP } from "./level";
import { makeDeb, PALLETE } from "./effects";

export default class Fireball extends EngineObject {
    constructor(_pos: Vector2, _vel: Vector2) {
        super(_pos, vec2(1, 1), tile(TILEMAP_LOOKUP.FIRE-1))
        this.velocity = _vel
        this.setCollision(true, false)
    }

    hide() {
        this.color.setHSLA(0, 0, 0, 0)
    }

    kill() {
        this.hide()
        this.destroy()
        makeDeb(this.pos, PALLETE.YELLOW)
    }

    collideWithTile(): boolean {
        this.kill()
        return false
    }

    collideWithObject(): boolean {
        this.kill()
        return false
    }

}