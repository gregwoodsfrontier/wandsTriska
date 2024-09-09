import { EngineObject, Vector2, vec2, Timer, tile, rand, getTileCollisionData} from "littlejsengine";
import { destroyTile, TILEMAP_LOOKUP } from "./level";
import { makeDeb, PALLETE, SE } from "./effects";

export default class SpikeBall extends EngineObject {
    constructor(_pos: Vector2) {
        super(_pos, vec2(0.8, 0.8), tile(TILEMAP_LOOKUP.SPIKEBALL-1))
        this.drawSize = vec2(1, 1)
        this.name = "spikeball"
        this.setCollision(true, true)
        this.mass = 1.0
        this.elasticity = 0.9
        this.groundTimer = new Timer()
        this.gTPeriod = 3
        this.destroyCooldown = new Timer()
        this.destroyedTilesN = 0

        this.velocity = vec2(
            1,
            rand(-2, 2)
        ).normalize(0.5)
    }

    name: string
    gTPeriod: number
    groundTimer: Timer
    destroyCooldown: Timer
    destroyedTilesN: number

    kill() {
        makeDeb(this.pos, PALLETE.RED)
        SE.SPIK_EXPLODE.play()
        this.destroy()
    }

    destroyWhenStillOnGnd() {
        if(this.getAliveTime() > 13 && this.groundTimer.elapsed()) {
            this.kill()
        }
    }

    update() {
        super.update()

        const getBottomTile = getTileCollisionData(this.pos.add(vec2(0, -1)))

        if(getBottomTile > 0 && !this.groundTimer.isSet()) {
            this.groundTimer.set(this.gTPeriod)
        } else if(getBottomTile <= 0) {
            this.groundTimer.unset()
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