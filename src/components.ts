import { EngineObject, Timer } from "littlejsengine";

// Define components
// Components can be any storage you want, here it is an SoA
export const PlayerTag = {
    maxSpeed: [] as number[]
}

export const EnemyTag = {
    name: [] as 'blob'[]|'demon'[]
}

export const TrapTag = {
    name: [] as 'spike'[]|'fire'[]
}

export const HealthComp = {
    health: [] as number[],
    damageTimer: [] as Timer[],
    deadTimer: [] as Timer[]
}

export const LadderAblity = {
    isTouching: [] as boolean[],
    isClimbing: [] as boolean[]
}

export const DamageComp = [] as number[]

export const EngineObjectsComp = [] as EngineObject[]

export const MoveInput = {
    x: [] as number[],
    y: [] as number[]
}

export const GroundTimer = [] as Timer[]

export const JumpData = {
    isHoldingJump: [] as boolean[],
    wasHoldingJump: [] as boolean[],
    pressedJumpTimer: [] as Timer[],
    jumpTimer: [] as Timer[],
    vel: [] as number[]
}