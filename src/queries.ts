import { defineEnterQueue, defineExitQueue, query, World } from "bitecs";
import { DamageComp, DestroyTileCount, EOC, GroundTimer, Health, JumpData, MoveInput, PlayerTag, TileCount, TrapTag } from "./components";

export const HealthEntityQuery = (_world: World) => {
    return query(_world, [Health, EOC])
}

export const DamagedEntityQuery = (_world: World) => {
    return query(_world, [Health, EOC, DamageComp])
}

export const MoveInputQueries = (_world: World) => {
    return query(_world, [MoveInput])
}

export const JumpingEntityQuery = (_world: World) => {
    return query(_world, [JumpData, GroundTimer, EOC])
}

export const PlayerMoveQueries = (_world: World) => {
    return query(_world, [MoveInput, PlayerTag, EOC])
}

export const playerHealthQuery = (_world: World) => {
    return query(_world, [PlayerTag, Health])
}

// export const playerQuery = (_world: World) => {
//     return query(_world, [PlayerTag])
// }

export const trapQuery = (_world: World) => {
    return query(_world, [TrapTag, EOC])
}

export const TileCountQuery = (_world: World) => {
    return query(_world, [TileCount, EOC])
}

export const EngineObjExitQueue = defineExitQueue([EOC])

export const DestroyTileEnterQueue = defineEnterQueue([EOC, DestroyTileCount, Health])