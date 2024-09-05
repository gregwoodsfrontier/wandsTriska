import { EngineObject, Vector2, vec2, Timer, tile, rand } from "littlejsengine";
import { destroyTile, TILEMAP_LOOKUP } from "./level";
import { makeDeb, PALLETE, SE } from "./effects";

export default class SpikeBall extends EngineObject {
    constructor(_pos: Vector2) {
        super(_pos, vec2(1, 1), tile(TILEMAP_LOOKUP.SPIKEBALL-1))
        this.name = "spikeball"
        this.setCollision(true, true)
        this.elasticity = 0.9
        this.groundTimer = new Timer()
        this.airTimer = new Timer()
        this.destroyCooldown = new Timer()
        this.destroyedTilesN = 0

        this.velocity = vec2(
            1,
            rand(-2, 2)
        ).normalize(0.5)
    }

    name: string
    groundTimer: Timer
    airTimer: Timer
    destroyCooldown: Timer
    destroyedTilesN: number

    kill() {
        makeDeb(this.pos, PALLETE.RED)
        SE.SPIK_EXPLODE.play()
        this.destroy()
    }

    destroyWhenStillOnGnd() {
        if(!this.groundTimer.active() && this.getAliveTime() > 13) {
            this.kill()
        }
    }

    update() {
        super.update()

        if(this.groundObject) {
            this.groundTimer.set(2)
            this.airTimer.unset()
        } else {
            this.groundTimer.unset()
            this.airTimer.set()
        }

        this.destroyWhenStillOnGnd()
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

        if(this.destroyedTilesN > 26) {
            this.kill()
        }

        return true
    }
}