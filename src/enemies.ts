import { addComponents, addEntity, World } from "bitecs"
import { EnemyTag, EngineObjectsComp, GroundTimer, HealthComp, JumpData } from "./components"

export const creatBlob = (_w: World) => {
     // the blob jumps randomly if it is close to player
    const e = addEntity(_w)
    addComponents(_w, [EnemyTag, EngineObjectsComp, HealthComp, GroundTimer, JumpData], e)
    EnemyTag.name[e] = 'blob'
    HealthComp.health[e] = 1
}

export const createDemon = (_w: World) => {
    // the demon slides sideways and change dir when hit an obstacle (or an edge)
    const e = addEntity(_w)
    addComponents(_w, [EnemyTag, EngineObjectsComp, HealthComp], e)
    EnemyTag.name[e] = 'demon'
    HealthComp.health[e] = 1
}

export const createSpikeBall = () => {

}

export const createFireBall = () => {
    
}