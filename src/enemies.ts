import { addComponents, addEntity, World } from "bitecs"
import { DestroyTileCount, EOC, Health, TrapTag } from "./components"
import { EngineObject, randInCircle, tile, Vector2 } from "littlejsengine"

export const createSpikeBall = (_w: World, _pos: Vector2, _size: Vector2) => {
    const e = addEntity(_w)
    addComponents(_w, [TrapTag, EOC, Health, DestroyTileCount], e)
    TrapTag.name[e] = 'spike'

    Health.maxValue[e] = 1
    Health.current[e] = Health.maxValue[e]

    EOC[e] = new EngineObject(_pos, _size, tile(12, 16))
    EOC[e].elasticity = 0.7
    EOC[e].setCollision(true, true)

    EOC[e].velocity = randInCircle(0.1)

    DestroyTileCount[e] = 0

}
