import {
    engineInit, setShowSplashScreen,
    Sound, 
    ParticleEmitter, tile,
    vec2,
    hsl,
    randColor,
    setCameraPos,
    setCameraScale,
    setGravity,
    mouseWasPressed,
    mousePos,
    mousePosScreen,
    drawRect,
    overlayContext,
    overlayCanvas,
    mainCanvasSize,
    percent,
    clamp,
    cameraPos,
    setObjectDefaultAngleDamping,
    setObjectDefaultDamping,
    cameraScale,
    mouseWheel,

} from 'littlejsengine'

import { createWorld, World } from 'bitecs';
import { inputSystem, playerMoveSystem, handleJumpSys, handleHealthSystem, handleDamageSystem, removeEngineObjectsSystem } from './systems';
import { playerHealthQuery } from './queries';
import { EngineObjectsComp, HealthComp } from './components';
import { loadLevel } from './level';

// Create a world
export const world = createWorld();

// show the LittleJS splash screen
setShowSplashScreen(false);

// sound effects
const sound_click = new Sound([1,.5]);

// medals

// game variables
let particleEmitter: ParticleEmitter;

const gameParams = {
    score: 0,
    deaths: 0
}

function getCameraTarget () {
    // camera is above player
    const offset = 2 * percent(mainCanvasSize.y, 300, 600);
    const playerEntity = playerHealthQuery(world)[0]
    const player = EngineObjectsComp[playerEntity]

    if(!player) return vec2(0, 0)

    return player.pos.add(vec2(0, offset));
}

function adjustCamera () {
    const playerEntity = playerHealthQuery(world)[0]
    const player = EngineObjectsComp[playerEntity]

    if(!player) return

    setCameraPos(cameraPos.lerp(getCameraTarget(), clamp(player.getAliveTime()/2)))
}

function initParams() {
    // init game
    gameParams.score = 0
    gameParams.deaths = 0
    setGravity(-.01)
    setObjectDefaultAngleDamping(.99)
    setObjectDefaultDamping(.99)
    setCameraScale(64)
    setCameraPos(getCameraTarget())
}

const getPlayerHealth = (_world: World) => {
    const entities = playerHealthQuery(_world)
    return HealthComp.health[entities[0]]
}

///////////////////////////////////////////////////////////////////////////////
function gameInit()
{
    // init game with params and configs
    initParams()

    /////
    // create particle emitter
    particleEmitter = new ParticleEmitter(
        vec2(16,9), 0,              // emitPos, emitAngle
        1, 0, 500, Math.PI,         // emitSize, emitTime, emitRate, emiteCone
        tile(14, 16),               // tileIndex, tileSize
        hsl(1,1,1),   hsl(0,0,0),   // colorStartA, colorStartB
        hsl(0,0,0,0), hsl(0,0,0,0), // colorEndA, colorEndB
        1, .2, .2, .1, .05,   // time, sizeStart, sizeEnd, speed, angleSpeed
        .99, 1, 1, Math.PI,   // damping, angleDamping, gravityScale, cone
        .05, .5, true, true   // fadeRate, randomness, collide, additive
    );
    particleEmitter.elasticity = .3; // bounce when it collides
    particleEmitter.trailScale = 2;  // stretch in direction of motion
    /////

    loadLevel()
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdate()
{
    inputSystem(world)
    playerMoveSystem(world)
    handleJumpSys(world)
    handleHealthSystem(world)
    handleDamageSystem(world)
    removeEngineObjectsSystem(world)

    setCameraScale(
        clamp(cameraScale * (1-mouseWheel*0.1), 1, 1e3)
    )

    /////
    if (mouseWasPressed(0))
    {
        // play sound when mouse is pressed
        // sound_click.play(mousePos);

        // change particle color and set to fade out
        particleEmitter.colorStartA = hsl();
        particleEmitter.colorStartB = randColor();
        particleEmitter.colorEndA = particleEmitter.colorStartA.scale(1,0);
        particleEmitter.colorEndB = particleEmitter.colorStartB.scale(1,0);
    }

    // move particles to mouse location if on screen
    if (mousePosScreen.x)
        particleEmitter.pos = mousePos;

    // mainLoop()
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdatePost()
{
    adjustCamera()
}

///////////////////////////////////////////////////////////////////////////////
function gameRender()
{
    // draw a grey square in the background without using webgl
    drawRect(vec2(16,8), vec2(20,30), hsl(0,0,.6), 0, false)
    
}

///////////////////////////////////////////////////////////////////////////////
function gameRenderPost()
{
    // draw to overlay canvas for hud rendering
    const drawText = (text: string, x: number, y: number, size=40) =>
    {
        overlayContext.textAlign = 'center';
        overlayContext.textBaseline = 'top';
        overlayContext.font = size + 'px arial';
        overlayContext.fillStyle = '#fff';
        overlayContext.lineWidth = 3;
        overlayContext.strokeText(text, x, y);
        overlayContext.fillText(text, x, y);
    }

    drawText(`Health: ${getPlayerHealth(world)}` ,   overlayCanvas.width*1/4, 20);
    drawText('Deaths: 0', overlayCanvas.width*3/4, 20);
    
}

///////////////////////////////////////////////////////////////////////////////
// Startup LittleJS Engine
engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, ['tiles.png']);