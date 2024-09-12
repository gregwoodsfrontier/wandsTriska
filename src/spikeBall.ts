import { EngineObject, Vector2, vec2, Timer, tile, rand, getTileCollisionData, hsl} from "littlejsengine";
import { destroyTile } from "./level";
import { makeDeb, PALLETE, SE } from "./effects";
import { TILEMAP_LOOKUP } from './global'

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
        if(this.groundTimer.elapsed()) {
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

    render() {
        super.render()
        if(this.groundTimer.active() && this.groundTimer.getPercent() > 0.15) {
            const per = this.groundTimer.getPercent()
            this.additiveColor = hsl(0, 0, 0, 0).lerp(hsl(0, 0, 1, 1), per)
        }
    }

    collideWithTile(tileData: number, pos: Vector2): boolean {
        if(tileData <= 0 || tileData === TILEMAP_LOOKUP.KEY || tileData === TILEMAP_LOOKUP.DOOR) return false

        destroyTile(pos)

        // for(let p of [-1, 1]) {
        //     if(getTileCollisionData(this.pos.add(vec2(p, 0))) === TILEMAP_LOOKUP.BREAK) {
        //         destroyTile(this.pos.add(vec2(p, 0)))
        //     }
        // }
        return true
    }
}