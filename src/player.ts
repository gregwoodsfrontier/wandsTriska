import { addComponent, addEntity, World } from "bitecs";
import { EngineObject, TileInfo, Timer, Vector2 } from "littlejsengine";
import { EngineObjectsComp, HealthComp, PlayerTag } from "./components";

export class Player extends EngineObject {
    eid: number

    constructor(_pos: Vector2, _size: Vector2, _tile: TileInfo, _world: World) {
        super(_pos, _size, _tile)

        this.eid = addEntity(_world)
        addComponent(_world, [PlayerTag, HealthComp, EngineObjectsComp], this.eid)

        HealthComp.health[this.eid] = 1
        HealthComp.damageTimer[this.eid] = new Timer
        HealthComp.deadTimer[this.eid] = new Timer

        EngineObjectsComp[this.eid] = this

        this.collideTiles = true
    }

    collideWithTile(tileData: number, pos: Vector2): boolean {
        console.log(tileData)
        console.log(pos)
        return true
    }
}