import { EngineObject, Vector2, vec2, Timer, tile, rand, tileCollisionSize } from "littlejsengine";
import { destroyTile, TILEMAP_LOOKUP } from "./level";

export default class SpikeBall extends EngineObject {
    constructor(_pos: Vector2, _size: Vector2) {
        super(_pos, _size, tile(TILEMAP_LOOKUP.SPIKEBALL-1))
        this.name = "spikeball"
        this.setCollision(true, true)
        this.elasticity = 1.01
        this.groundTimer = new Timer()
        this.airTimer = new Timer()
        this.destroyCooldown = new Timer()
        this.destroyedTilesN = 0

        this.velocity = vec2(
            rand(-1, 1),
            1
        ).normalize(1)
    }

    name: string
    groundTimer: Timer
    airTimer: Timer
    destroyCooldown: Timer
    destroyedTilesN: number

    update() {
        super.update()

        if(this.groundObject) {
            this.groundTimer.set()
            this.airTimer.unset()
        } else {
            this.groundTimer.unset()
            this.airTimer.set()
        }

        // if(this.pos.y < (tileCollisionSize.y - 3)) {
        //     this.destroy()
        // }
    }

    collideWithTile(tileData: number, pos: Vector2): boolean {
        if(tileData <= 0) return false

        let state_obj = destroyTile(pos, this.destroyCooldown)
        this.destroyCooldown = state_obj.cd
        
        if(state_obj.ch) {
            this.destroyedTilesN++
            if(pos.y < this.pos.y) {
                this.velocity.add(vec2(1, 0)).normalize(0.75)
            }
        }

        if(this.destroyedTilesN > 4) {
            this.destroy()
        }

        return true
    }
}