import {
    engineInit, setShowSplashScreen,
    vec2,
    hsl,
    setCameraScale,
    setGravity,
    drawRect,
    overlayContext,
    overlayCanvas,
    clamp,
    setObjectDefaultAngleDamping,
    setObjectDefaultDamping,
    cameraScale,
    mouseWheel,
    tileCollisionSize,
    setCameraPos,
    engineObjects,
    Vector2,
} from 'littlejsengine'
import { loadLevel } from './level';
import { data } from './tileLayerData';
import SpikeBall from './spikeBall';

// Create a world

// show the LittleJS splash screen
setShowSplashScreen(false);

// sound effects
// const sound_click = new Sound([1,.5]);

// medals

// game variables
// let particleEmitter: ParticleEmitter;

export const gameData = {
    numOfSpikeBalls: 0,
    totalSteps: 0
}

export const spawnSpikeBall = (_pos: Vector2) => {
    new SpikeBall(_pos)
    gameData.numOfSpikeBalls++
}

export const incrementTotSteps = () => {
    gameData.totalSteps++
}

function initParams() {
    // init game
    gameData.numOfSpikeBalls = 0
    gameData.totalSteps = 0
    setGravity(-.01)
    setObjectDefaultAngleDamping(.99)
    setObjectDefaultDamping(.99)
    setCameraScale(64)
}

///////////////////////////////////////////////////////////////////////////////
function gameInit()
{
    initParams()
    // loadLevel()
    loadLevel(data)
    // init game with params and configs
   
    setCameraPos(engineObjects.filter(e => e.name === 'player')[0].pos)
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdate()
{
    setCameraScale(
        clamp(cameraScale * (1-mouseWheel*0.1), 1, 1e3)
    )
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdatePost()
{

}

///////////////////////////////////////////////////////////////////////////////
function gameRender()
{
    // draw a grey square in the background without using webgl
    drawRect(tileCollisionSize.divide(vec2(2,2)), vec2(100, 100), hsl(0,0,.6), 0, false)
    
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

    drawText('Steps: '+gameData.totalSteps, overlayCanvas.width*1/4, 20);
    drawText('Spawned Spikes: '+gameData.numOfSpikeBalls, overlayCanvas.width*3/4 - 0.1, 20);
    
}

///////////////////////////////////////////////////////////////////////////////
// Startup LittleJS Engine
engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, ['t2com.png']);