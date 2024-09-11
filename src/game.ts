import {
    engineInit,
    setCameraScale,
    setGravity,
    overlayContext,
    overlayCanvas,
    clamp,
    setObjectDefaultAngleDamping,
    setObjectDefaultDamping,
    cameraScale,
    mouseWheel,
    setCameraPos,
    engineObjects,
    Vector2,
    mainContext,
    mainCanvas,
    mainCanvasSize,
    tile,
    vec2,
    drawTile,
    tileCollisionSize,
    rgb,
    Timer,
    drawRect,
    hsl,
    drawText,
    drawTextScreen
} from 'littlejsengine'
import { loadLevel, TILEMAP_LOOKUP } from './level';
import { data } from './tileLayerData';
import SpikeBall from './spikeBall';
import Sky from './sky';

// holds the game state and relevant game data
export const gameData = {
    numOfSpikeBalls: 0,
    totalSteps: 0,
    isPlaying: true,
    isGameOver: true,
    isWin: false,
    gameOverTimer: new Timer()
}

export const spawnSpikeBall = (_pos: Vector2) => {
    new SpikeBall(_pos)
    gameData.numOfSpikeBalls++
}

export const incrementTotSteps = () => {
    gameData.totalSteps++
}

export const createGameOverOverlay = () => {
    drawRect(vec2(overlayCanvas.width/2, overlayCanvas.height/2), vec2(30, 30), hsl(0, 0, 0.5, 1), 0, false, true, overlayContext)
    drawTextScreen('YOU WIN !!!', vec2(overlayCanvas.width/2, overlayCanvas.height/2), 40, hsl(0, 0, 1, 1), 3, hsl(0, 0, 0, 1), 'center', '12px arial' ,overlayContext)
}

export const drawGameText = (_context: CanvasRenderingContext2D, text: string, x: number, y: number, size=40) => {
    _context.textAlign = 'center';
    _context.textBaseline = 'top';
    _context.font = size + 'px arial';
    _context.fillStyle = '#fff';
    _context.lineWidth = 3;
    _context.strokeText(text, x, y);
    _context.fillText(text, x, y);
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
    loadLevel(data)

    // create sky
    new Sky()
   
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
    drawGameText(overlayContext ,'<= | => , ^ to jump, C to fire', overlayCanvas.width/2, overlayCanvas.height*0.1);
}

///////////////////////////////////////////////////////////////////////////////
function gameRenderPost()
{
 
    drawGameText(overlayContext ,'Steps: '+gameData.totalSteps, overlayCanvas.width*1/4, 20);
    drawGameText(overlayContext ,'Spawned Spikes: '+gameData.numOfSpikeBalls, overlayCanvas.width*3/4 - 0.1, 20);

    createGameOverOverlay()
    // drawGameText(overlayContext ,'text', overlayCanvas.width/2, overlayCanvas.height/2);
    
}

///////////////////////////////////////////////////////////////////////////////
// Startup LittleJS Engine
engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, ['t2com.png']);
