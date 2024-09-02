import { EngineObject, TileInfo, Vector2, vec2, clamp, isUsingGamepad, gamepadStick, keyIsDown, Timer, sign, gamepadIsDown } from "littlejsengine";

const airControlSystem = (_gnT: Timer, _mov: Vector2, _vel: Vector2) => {
    if(_gnT && !_gnT.isSet()) {
        if (sign(_mov.x) == sign(_vel.x))
            _mov.x *= .1; // moving with velocity
        else
            _mov.x *= .2; // moving against velocity (stopping)
    }

    return _mov
}

const playerMoveSys = (_move: Vector2, _vel: Vector2, _max: number, _mir: boolean) => {
    _vel.x = clamp(
        _vel.x + _move.x * 0.042,
        -_max,
        _max
    )

    return _vel
}

const mirrorHandling = (_mv: Vector2, _mir: boolean) => {
    if(_mv.x) {
        _mir = _mv.x < 0
    }

    return _mir
}

export default class Player extends EngineObject {
    constructor(_pos: Vector2, _size: Vector2, _tile: TileInfo) {
        super(_pos, _size, _tile)
        this.name = "player"
        this.drawSize = vec2(1, 1)
        this.setCollision(true, true)
        this.groundTimer = new Timer()
        this.pressedJumpTimer = new Timer()
        this.jumpTimer = new Timer()
    }

    name: string
    moveInput = vec2(0, 0)
    maxSpeed = 0.25
    groundTimer: Timer
    pressedJumpTimer: Timer
    jumpTimer: Timer
    holdingJump = false
    wasHoldJump = false

    inputSystem() {
        this.moveInput = isUsingGamepad ? gamepadStick(0) : vec2(keyIsDown('ArrowRight')?1:0 - (keyIsDown('ArrowLeft')?1:0), 
        keyIsDown('ArrowUp')?1:0 - (keyIsDown('ArrowDown')?1:0));

        this.holdingJump   = keyIsDown('ArrowUp') || gamepadIsDown(0);
    }

    jumpHandling() {
        if(!this.holdingJump) {
            this.pressedJumpTimer.unset()
        } else if (!this.wasHoldJump) {
            this.pressedJumpTimer.set(0.3)
        }
        this.wasHoldJump = this.holdingJump

        if(this.groundTimer.active()) {
            if(this.pressedJumpTimer.active() && ! this.jumpTimer.active()) {
                this.velocity.y = .15;
                this.jumpTimer.set(.2)
            }
        }

        if(this.jumpTimer.active()) {
            this.groundTimer.unset();
            if(this.holdingJump && this.velocity.y > 0) {
                this.velocity.y += .017;
            }
        }
    }

    update() {
        super.update()

        if(this.groundObject) {
            this.groundTimer.set()
        } else {
            this.groundTimer.unset()
        }

        this.inputSystem()
        this.jumpHandling()
        this.moveInput = airControlSystem(this.groundTimer, this. moveInput, this.velocity)
        this.velocity = playerMoveSys(this.moveInput, this.velocity, this.maxSpeed, this.mirror)
        this.mirror = mirrorHandling(this.moveInput, this.mirror)
    }
}