import { query, World } from "bitecs";
import { EngineObjectsComp, GroundTimer, JumpData, MoveInput, PlayerTag } from "./components";

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

