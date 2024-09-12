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
    keyWasPressed,
    engineObjectsDestroy,
    tile,
    drawTextScreen,
    hsl,
    vec2,
    lerp,
    max} from 'littlejsengine'
import { loadLevel } from './level';
import { data } from './tileLayerData';
import Sky from './sky';
import { gameData, drawGameText, setGameOver, setPlayingGame, createGameOverOverlay, tileData2, tileLayers, playerGroup, createPlayer } from './global';

function initParams() {
    // init game
    gameData.numOfSpikeBalls = 0
    gameData.totalSteps = 0
    tileData2.length = 0
    tileLayers.length = 0
    playerGroup.length = 0
    setGravity(-.01)
    setObjectDefaultAngleDamping(.99)
    setObjectDefaultDamping(.99)
    setCameraScale(32)
    setPlayingGame()
}

///////////////////////////////////////////////////////////////////////////////
function gameInit()
{
    engineObjectsDestroy()
    initParams()
    loadLevel(data)
    // create sky
    new Sky()
    setCameraPos(playerGroup[0].pos)
    playerGroup[0].setStartGameParams()
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdate()
{
    setCameraScale(
        clamp(cameraScale * (1-mouseWheel*0.1), 1, 1e3)
    )

    if(playerGroup[0].isDead) {
        if(playerGroup[0].deathTimer.elapsed()) {
            playerGroup.length = 0
            playerGroup.push(createPlayer(gameData.playerStartPos))
            setCameraPos(playerGroup[0].pos)
        }
    }

    if(gameData.gameOverTimer.elapsed()) {
        gameInit()
    }
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdatePost()
{

}

///////////////////////////////////////////////////////////////////////////////
function gameRender()
{
    drawGameText(overlayContext ,'<= | => , ^ to jump, C to fire', overlayCanvas.width/2, overlayCanvas.height*0.1, 45);
}

///////////////////////////////////////////////////////////////////////////////
function gameRenderPost()
{
    if(playerGroup[0]) {
        const remainSteps = 13 - playerGroup[0].getCountTile
        drawGameText(overlayContext ,`${remainSteps} Steps to Spikes`, overlayCanvas.width*1/4, 20, 40*lerp(1-(remainSteps/13), 1, 2));
        drawGameText(overlayContext ,'Spawned Spikes: '+ gameData.numOfSpikeBalls, overlayCanvas.width*3/4 - 0.1, 20);
    
        // show key state if obtained
        if(playerGroup[0].hasKey) {
            drawGameText(overlayContext, '[KEY]', overlayCanvas.width*1/2, 20);
        }    
    }
    
    if(gameData.gameOverTimer.active()) {
        createGameOverOverlay()
    }
}

///////////////////////////////////////////////////////////////////////////////
// Startup LittleJS Engine
engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, ['t2com.png']);
