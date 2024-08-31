import { addComponent, removeComponent, removeEntity, World } from "bitecs"
import { keyIsDown, gamepadIsDown, isUsingGamepad, gamepadStick, clamp, percent, hsl, max, keyWasPressed, mousePos, vec2, Timer, min, sign, TileLayer } from "littlejsengine"
import { JumpData, MoveInput, EngineObjectsComp, GroundTimer, PlayerTag, Health, DamageComp, DamageTimerComp, DeadTimerComp, DestroyTileCount, TileCount } from "./components"
import { MoveInputQueries, JumpingEntityQuery, PlayerMoveQueries, HealthEntityQuery, DamagedEntityQuery, EngineObjExitQueue, trapQuery, DestroyTileEnterQueue, TileCountQuery } from "./queries"
import { createSpikeBall } from "./enemies"
import { destroyTile } from "./level"
import { world } from "./game"

export const removeEngineObjectsSystem = (_world: World) => {
    for(let e of EngineObjExitQueue(_world)) {
        EngineObjectsComp[e].destroy()
    }
}

export const tileCountingSystem = (_w: World) => {
    for(let e of TileCountQuery(_w)) {
        const {pos} = EngineObjectsComp[e]
        const{prePosX, current, trigger} = TileCount
        const delta = Math.abs(pos.x - prePosX[e])

        if(EngineObjectsComp[e].groundObject) {
            current[e] += Math.floor(delta*100)/100
        }
        
        if(Math.floor(current[e]) > trigger[e]) {
            console.log("trigger")
            createSpikeBall(world, pos.add(vec2(3, 3)), vec2(1, 1))
            current[e] %= trigger[e]+1
        }

        TileCount.prePosX[e] = pos.x
    }
}

export const destroyTileSystem = (_w: World, _tileLayers: TileLayer[], _tileData: number[][]) => {
    for(let e of DestroyTileEnterQueue(_w)) {
        EngineObjectsComp[e].collideWithTile = (data, pos) => {
            if(data <= 0) return false

            const check = destroyTile(pos, _tileLayers, _tileData)

            if (check) {
                DestroyTileCount[e] += 1
            }

            if (DestroyTileCount[e] > 4) {
                Health.current[e] = 0
            }
            
            return true
        }
    }
}

export const handleHealthSystem = (_world: World) => {
    const isDead = (_e: number) => {
        return Health.current[_e] <= 0
    }

    for(let e of HealthEntityQuery(_world)) {
        Health.current[e] = min(Health.current[e], Health.maxValue[e])

        if(isDead(e)) {
            DeadTimerComp[e] = new Timer()
            removeEntity(_world, e)
        }

        if(Health.current[e] > 0 && EngineObjectsComp[e].pos.y < -9) {
            removeEntity(_world, e)
        }
    }


}

export const handleDamageSystem = (_world: World) => {
    for(let e of DamagedEntityQuery(_world)) {
        addComponent(_world, DamageTimerComp, e)

        DamageTimerComp[e] = new Timer()

        const new_health = max(Health.current[e] - DamageComp[e], 0)
        Health.current[e] = new_health

        if(Health.current[e] > 0 && DamageTimerComp[e].isSet()) {
            const a = .5 * percent(DamageTimerComp[e].getPercent(), .15, 0)
            EngineObjectsComp[e].additiveColor = hsl(0, 0, a, 0)
        } else {
            EngineObjectsComp[e].additiveColor = hsl(0, 0, 0, 0)
        }

        removeComponent(_world, DamageComp, e)
    }
}

export const renderTrapSystem = (_w: World) => {
    for(let e of trapQuery(_w)) {
        if(Math.abs(EngineObjectsComp[e].velocity.x) < 0.005) continue
        EngineObjectsComp[e].angle += .09 * sign(EngineObjectsComp[e].velocity.x)
    }
}

export const inputSystem = (_world: World) => {
    for(let e of JumpingEntityQuery(_world)) {
        JumpData.isHoldingJump[e] = keyIsDown('ArrowUp') || gamepadIsDown(0)
    }

    for (let e of MoveInputQueries(_world)) {
        MoveInput.x[e] = isUsingGamepad ? gamepadStick(0).x : keyIsDown("ArrowRight") ? 1 : keyIsDown("ArrowLeft") ? -1 : 0
        MoveInput.y[e] = isUsingGamepad ? gamepadStick(0).y : keyIsDown("ArrowUp") ? 1 : keyIsDown("ArrowDown") ? -1 : 0
    }

    if(keyWasPressed("KeyT")) {
        console.log("T debug key was pressed")
        createSpikeBall(_world, mousePos, vec2(1, 1))
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

        // update variable height jump
        if(JumpData.jumpTimer[e].active()) {
            GroundTimer[e].unset()

            if(JumpData.isHoldingJump[e] && EngineObjectsComp[e].velocity.y > 0) {
                EngineObjectsComp[e].velocity.y += 0.009
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