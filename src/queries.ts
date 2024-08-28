import { defineExitQueue, query, World } from "bitecs";
import { DamageComp, EngineObjectsComp, GroundTimer, HealthComp, JumpData, MoveInput, PlayerTag } from "./components";

export const HealthEntityQuery = (_world: World) => {
    return query(_world, [HealthComp, EngineObjectsComp])
}

export const DamagedEntityQuery = (_world: World) => {
    return query(_world, [HealthComp, EngineObjectsComp, DamageComp])
}

export const MoveInputQueries = (_world: World) => {
    return query(_world, [MoveInput])
}

export const JumpQuery = (_world: World) => {
    return query(_world, [JumpData])
}

export const JumpingEntityQuery = (_world: World) => {
    return query(_world, [JumpData, GroundTimer, EngineObjectsComp])
}

export const PlayerMoveQueries = (_world: World) => {
    return query(_world, [MoveInput, PlayerTag, EngineObjectsComp])
}

export const playerHealthQuery = (_world: World) => {
    return query(_world, [PlayerTag, HealthComp])
}

export const playerQuery = (_world: World) => {
    return query(_world, [PlayerTag])
}

export const EngineObjExitQueue = defineExitQueue([EngineObjectsComp])