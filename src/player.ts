import { World, addEntity, addComponent } from "bitecs"
import { Vector2, TileInfo, Timer, EngineObject, vec2 } from "littlejsengine"
import { PlayerTag, MoveInput, Health, JumpData, GroundTimer, EngineObjectsComp } from "./components"

export const createPlayerByEntity = (_pos: Vector2, _size: Vector2, _tile: TileInfo, _world: World) => {
    const e = addEntity(_world)
    const comps = [PlayerTag, MoveInput, Health, JumpData, GroundTimer, EngineObjectsComp]

    for(let i = 0; i < comps.length; i++) {
        addComponent(_world, comps[i], e)
    }

    Health.maxValue[e] = 5
    Health.current[e] = Health.maxValue[e]

    PlayerTag.maxSpeed[e] = 0.2

    MoveInput.x[e] = 0
    MoveInput.y[e] = 0

    JumpData.isHoldingJump[e] = false
    JumpData.wasHoldingJump[e] = false
    JumpData.jumpTimer[e] = new Timer
    JumpData.pressedJumpTimer[e] = new Timer
    JumpData.vel[e] = 0.25

    GroundTimer[e] = new Timer

    EngineObjectsComp[e] = new EngineObject(_pos, _size, _tile)

    EngineObjectsComp[e].drawSize = vec2(1, 1)
    EngineObjectsComp[e].setCollision(true, false, true)
}