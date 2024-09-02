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
    EngineObject,
    setCameraPos,
    mouseWasPressed,
    mousePos,
} from 'littlejsengine'
import { addTile, loadLevel, TILEMAP_LOOKUP } from './level';
import { data } from './tileLayerData';

// Create a world

// show the LittleJS splash screen
setShowSplashScreen(false);

// sound effects
// const sound_click = new Sound([1,.5]);

// medals

// game variables
// let particleEmitter: ParticleEmitter;

const gameParams = {
    score: 0,
    deaths: 0
}

const ent = [] as EngineObject[]

function initParams() {
    // init game
    gameParams.score = 0
    gameParams.deaths = 0
    setGravity(-.01)
    setObjectDefaultAngleDamping(.99)
    setObjectDefaultDamping(.99)
    setCameraScale(64)
}

///////////////////////////////////////////////////////////////////////////////
function gameInit()
{
    // loadLevel()
    loadLevel(data, ent)
    // init game with params and configs
    initParams()
    setCameraPos(ent[0].pos)
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdate()
{
    setCameraScale(
        clamp(cameraScale * (1-mouseWheel*0.1), 1, 1e3)
    )

    if(mouseWasPressed(0)) {
        addTile(mousePos, TILEMAP_LOOKUP.BREAK)
    }
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdatePost()
{

}

///////////////////////////////////////////////////////////////////////////////
function gameRender()
{
    // draw a grey square in the background without using webgl
    drawRect(tileCollisionSize.divide(vec2(2,2)), tileCollisionSize, hsl(0,0,.6), 0, false)
    
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

    drawText('Deaths: 0', overlayCanvas.width*3/4, 20);
    
}

///////////////////////////////////////////////////////////////////////////////
// Startup LittleJS Engine
engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, ['t2com.png']);