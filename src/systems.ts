import { removeComponent, removeEntity, World } from "bitecs"
import { keyIsDown, gamepadIsDown, isUsingGamepad, gamepadStick, clamp, percent, hsl, max } from "littlejsengine"
import { JumpData, MoveInput, EngineObjectsComp, GroundTimer, PlayerTag, HealthComp, DamageComp } from "./components"
import { JumpQuery, MoveInputQueries, JumpingEntityQuery, PlayerMoveQueries, HealthEntityQuery, DamagedEntityQuery, EngineObjExitQueue } from "./queries"

export const removeEngineObjectsSystem = (_world: World) => {
    for(let e of EngineObjExitQueue(_world)) {
        EngineObjectsComp[e].destroy()
    }
}

export const handleHealthSystem = (_world: World) => {
    const isDead = (_e: number) => {
        return HealthComp.health[_e] <= 0
    }

    for(let e of HealthEntityQuery(_world)) {
        if(isDead(e)) {
            removeEntity(_world, e)
            // EngineObjectsComp[e].destroy()
        }

        if(HealthComp.health[e] > 0 && HealthComp.damageTimer[e].isSet()) {
            const a = .5 * percent(HealthComp.damageTimer[e].getPercent(), .15, 0)
            EngineObjectsComp[e].additiveColor = hsl(0, 0, a, 0)
        } else {
            EngineObjectsComp[e].additiveColor = hsl(0, 0, 0, 0)
        }

        if(HealthComp.health[e] > 0 && EngineObjectsComp[e].pos.y < -9) {
            removeEntity(_world, e)
            // EngineObjectsComp[e].destroy()
        }
    }
}

export const handleDamageSystem = (_world: World) => {
    for(let e of DamagedEntityQuery(_world)) {
        const new_health = max(HealthComp.health[e] - DamageComp[e], 0)
        HealthComp.health[e] = new_health

        removeComponent(_world, DamageComp, e)
    }
}

export const inputSystem = (_world: World) => {
    for(let e of JumpQuery(_world)) {
        JumpData.isHoldingJump[e] = keyIsDown('ArrowUp') || gamepadIsDown(0)
    }

    for (let e of MoveInputQueries(_world)) {
        MoveInput.x[e] = isUsingGamepad ? gamepadStick(0).x : keyIsDown("ArrowRight") ? 1 : keyIsDown("ArrowLeft") ? -1 : 0
        MoveInput.y[e] = isUsingGamepad ? gamepadStick(0).y : keyIsDown("ArrowUp") ? 1 : keyIsDown("ArrowDown") ? -1 : 0
    }
}

export const handleJumpSys = (_world: World) => {
    for(let e of JumpingEntityQuery(_world)) {
        if(!JumpData.isHoldingJump[e]) {
            JumpData.pressedJumpTimer[e].unset()
        } else if (!JumpData.wasHoldingJump[e]) {
            JumpData.pressedJumpTimer[e].set(0.3)
        }

        JumpData.wasHoldingJump[e] = JumpData.isHoldingJump[e]

        if(EngineObjectsComp[e].groundObject) {
            GroundTimer[e].set(0.1)
        }

        if(GroundTimer[e] && GroundTimer[e].active()){
            if(JumpData.pressedJumpTimer[e].active()) {
                EngineObjectsComp[e].velocity.y = JumpData.vel[e]
                JumpData.jumpTimer[e].set(0.2)
            }
        }
    }
}

export const playerMoveSystem = (_world: World) => {
    for (let e of PlayerMoveQueries(_world)) {
        EngineObjectsComp[e].velocity.x = clamp(EngineObjectsComp[e].velocity.x + MoveInput.x[e] * 0.042, -PlayerTag.maxSpeed[e], PlayerTag.maxSpeed[e])

        if(MoveInput.x[e]) {
            EngineObjectsComp[e].mirror = MoveInput.x[e] < 0
        }
    }
}