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
    keyWasPressed} from 'littlejsengine'
import { loadLevel } from './level';
import { data } from './tileLayerData';
import Sky from './sky';
import { gameData, drawGameText, setGameOver, setPlayingGame } from './global';

function initParams() {
    // init game
    gameData.numOfSpikeBalls = 0
    gameData.totalSteps = 0
    setGravity(-.01)
    setObjectDefaultAngleDamping(.99)
    setObjectDefaultDamping(.75)
    setCameraScale(32)
    setPlayingGame()
}

///////////////////////////////////////////////////////////////////////////////
function gameInit()
{
    initParams()
    
    loadLevel(data)

    // create sky
    new Sky()
   
    setCameraPos(engineObjects.filter(e => e.name === 'player')[0].pos)
    if(import.meta.env.DEV) {
        console.log("overlay width: ", overlayCanvas.width)
        console.log("overlay height: ", overlayCanvas.height)
    }
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdate()
{
    setCameraScale(
        clamp(cameraScale * (1-mouseWheel*0.1), 1, 1e3)
    )

    // test function
    if(import.meta.env.DEV) {
        if(keyWasPressed("KeyY")) {
            setGameOver()
        }
    }
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdatePost()
{

}

///////////////////////////////////////////////////////////////////////////////
function gameRender()
{
    // drawText("<= | => , ^ to jump, C to fire", vec2(15,38), 10000/cameraScale, hsl(0, 0, 1, 1), 0, hsl(0, 0, 0, 1), 'center', '120px arial')
    drawGameText(overlayContext ,'<= | => , ^ to jump, C to fire', overlayCanvas.width/2, overlayCanvas.height*0.1, 45);
}

///////////////////////////////////////////////////////////////////////////////
function gameRenderPost()
{
 
    drawGameText(overlayContext ,'Steps: '+gameData.totalSteps, overlayCanvas.width*1/4, 20);
    drawGameText(overlayContext ,'Spawned Spikes: '+gameData.numOfSpikeBalls, overlayCanvas.width*3/4 - 0.1, 20);

    // createGameOverOverlay()
    
}

///////////////////////////////////////////////////////////////////////////////
// Startup LittleJS Engine
engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, ['t2com.png']);
