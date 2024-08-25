import { EngineObject, TileInfo, Timer } from "littlejsengine";

// Define components
// Components can be any storage you want, here it is an SoA

export const HealthComp = {
    health: [] as number[],
    damageTimer: [] as Timer[],
    deadTimer: [] as Timer[]
}

export const EngineObjectsComp = [] as EngineObject[]

export const PlayerTag = [] as true[]