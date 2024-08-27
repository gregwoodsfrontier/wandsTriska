import { EngineObject, Timer } from "littlejsengine";

// Define components
// Components can be any storage you want, here it is an SoA

export const HealthComp = {
    health: [] as number[],
    damageTimer: [] as Timer[],
    deadTimer: [] as Timer[]
}

export const DamageComp = [] as number[]

export const EngineObjectsComp = [] as EngineObject[]

export const PlayerTag = {
    maxSpeed: [] as number[]
}

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