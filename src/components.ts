import { EngineObject, Timer } from "littlejsengine";

// Define components
// Components can be any storage you want, here it is an SoA
export const PlayerTag = {
    maxSpeed: [] as number[]
}

export const TileCount = {
    distacnePerCount: [] as number[],
    prePosX: [] as number[], // parameter to keep track of the position x previous frame
    current: [] as number[],
    trigger: [] as number[]
}

export const EnemyTag = {
    name: [] as 'blob'[]|'demon'[]
}

export const TrapTag = {
    name: [] as 'spike'[]|'fire'[]
}

export const Health = {
    current: [] as number[],
    maxValue: [] as number[]
}

export const DeadTimerComp = [] as Timer[]

export const DamageTimerComp = [] as Timer[]

export const DamageComp = [] as number[]

export const EOC = [] as EngineObject[]

export const MoveInput = {
    x: [] as number[],
    y: [] as number[]
}

export const GroundTimer = [] as Timer[]

export const AliveTime = [] as Timer[]

export const DestroyTileCount = [] as number[]

export const JumpData = {
    isHoldingJump: [] as boolean[],
    wasHoldingJump: [] as boolean[],
    pressedJumpTimer: [] as Timer[],
    jumpTimer: [] as Timer[],
    vel: [] as number[]
}