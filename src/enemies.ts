import { addComponents, addEntity, World } from "bitecs"
import { EnemyTag, EngineObjectsComp, GroundTimer, Health, JumpData, TrapTag } from "./components"
import { EngineObject, randInCircle, sign, tile, Vector2 } from "littlejsengine"

export const creatBlob = (_w: World) => {
     // the blob jumps randomly if it is close to player
    const e = addEntity(_w)
    addComponents(_w, [EnemyTag, EngineObjectsComp, Health, GroundTimer, JumpData], e)
    EnemyTag.name[e] = 'blob'
    Health.maxValue[e] = 1
}

export const createDemon = (_w: World) => {
    // the demon slides sideways and change dir when hit an obstacle (or an edge)
    const e = addEntity(_w)
    addComponents(_w, [EnemyTag, EngineObjectsComp, Health], e)
    EnemyTag.name[e] = 'demon'
    Health.maxValue[e] = 1
}

export const createSpikeBall = (_w: World, _pos: Vector2, _size: Vector2) => {
    const e = addEntity(_w)
    addComponents(_w, [TrapTag, EngineObjectsComp, Health], e)
    TrapTag.name[e] = 'spike'

    Health.maxValue[e] = 1
    Health.current[e] = Health.maxValue[e]

    EngineObjectsComp[e] = new EngineObject(_pos, _size, tile(12, 16))
    EngineObjectsComp[e].elasticity = 0.5
    EngineObjectsComp[e].setCollision(true, true)

    EngineObjectsComp[e].velocity = randInCircle(0.1)
}

export const createFireBall = () => {
    
}