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
    timeDelta,
} from 'littlejsengine'
import { loadLevel2, p } from './level';
import { data } from './tileLayerData';
import { addComp, addEntity, addSys, ecsUpdate, getComp, w } from './microEcs';

// Create a world

// show the LittleJS splash screen
setShowSplashScreen(false);

// sound effects
// const sound_click = new Sound([1,.5]);

// medals

// game variables
// let particleEmitter: ParticleEmitter;

let e1: number
let e2: number

const gameParams = {
    score: 0,
    deaths: 0
}

function initParams() {
    // init game
    gameParams.score = 0
    gameParams.deaths = 0
    setGravity(-.01)
    setObjectDefaultAngleDamping(.99)
    setObjectDefaultDamping(.99)
    setCameraScale(64)
}

const posComp = (x = 0, y = 0) => ({ x, y });
const velComp = (vx = 0, vy = 0) => ({ vx, vy });

///////////////////////////////////////////////////////////////////////////////
function gameInit()
{
    // init game with params and configs
    initParams()

    // loadLevel()
    loadLevel2(data)

    setCameraPos(p.pos)

    addSys(['pos', 'vel'], (e:number, dt:number) => {
        const p = getComp(e, 'pos'), v = getComp(e, 'vel');
        p.x += v.vx * dt; p.y += v.vy * dt;
    });

    e1 = addEntity();
    addComp(e1, 'pos', posComp(1, 2));
    addComp(e1, 'vel', velComp(0.1, 0.1));

    e2 = addEntity();
    addComp(e2, 'pos', posComp(10, 20));
    // addComp(e2, 'vel', velComp(0.1, 0.1));

    console.log(w.ents)
    console.log(w.comps)
    console.log(w.sys)
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdate()
{
    ecsUpdate(timeDelta)

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

    drawText('PosX e1: ' + getComp(e1, 'pos').x, overlayCanvas.width*1/4, 20);
    drawText('PosX e2: '  + getComp(e2, 'pos').x, overlayCanvas.width*3/4, 20);
    
}

///////////////////////////////////////////////////////////////////////////////
// Startup LittleJS Engine
engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, ['tiles.png']);