import {
    engineInit, setShowSplashScreen,
    Sound, 
    ParticleEmitter, tile,
    vec2,
    hsl,
    initTileCollision,
    TileLayer,
    TileLayerData,
    randColor,
    setTileCollisionData,
    setCameraPos,
    setCameraScale,
    setGravity,
    mouseWasPressed,
    mousePos,
    mousePosScreen,
    drawRect,
    Vector2,
    overlayContext,
    overlayCanvas,
    tileCollisionSize,
    mainCanvasSize,
    percent,
    clamp,
    cameraPos,
    gravity,
    objectDefaultAngleDamping,
    objectDefaultDamping,
    setObjectDefaultAngleDamping,
    setObjectDefaultDamping,

} from 'littlejsengine'

import { createWorld, World } from 'bitecs';
import { createPlayerByEntity } from './player';
import { inputSystem, playerMoveSystem, handleJumpSys, handleHealthSystem, handleDamageSystem, removeEngineObjectsSystem } from './systems';
import { playerHealthQuery, PlayerMoveQueries } from './queries';
import { EngineObjectsComp, HealthComp } from './components';

async function getTileMapData(link: string) {
    const response = await fetch(link);
    const data = await response.json();

    return data;
}


// Create a world
const world = createWorld();


// show the LittleJS splash screen
setShowSplashScreen(false);

// sound effects
const sound_click = new Sound([1,.5]);

// medals

// game variables
let particleEmitter: ParticleEmitter;

let levelSize: Vector2

const gameParams = {
    score: 0,
    deaths: 0
}

const tileData = [] as number[][]
const tileLay = [] as TileLayer[]

const setTileData = (pos: Vector2, layer: number, data: number)=>
    pos.arrayCheck(tileCollisionSize) && (tileData[layer][(pos.y|0)*tileCollisionSize.x+pos.x|0] = data);

const getTileData = (pos: Vector2, layer: number)=>
    pos.arrayCheck(tileCollisionSize) ? tileData[layer][(pos.y|0)*tileCollisionSize.x+pos.x|0]: 0;


enum TILETYPE {
    break = 2,
    solid = 3,
    ladder = 4
}

enum TILEMAP_LOOKUP {
    player = 10,
    demon = 15,
    blob = 11,
    tri = 12,
    spike = 13,
    fireball = 14
}

function getCameraTarget () {
    // camera is above player
    const offset = 3 * percent(mainCanvasSize.y, 300, 600);
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

function loadLevel() {
    getTileMapData("/gameLevelData.json").then((data) => {
        const tm = data
        levelSize = vec2(tm.width, tm.height)
        initTileCollision(levelSize)
        // engineObjectsDestroy()

        if(tm.layers) {
            const layerCount = tm.layers.length
            for(let i = 0; i < layerCount; i++) {
                switch (tm.layers[i].name){
                    case "foreground": 
                        const layerData = tm.layers[i].data
                        tileLay[i] = new TileLayer(vec2(), levelSize, tile(0,16,));
                        tileData[i] = []

                        for(let x = levelSize.x; x--;) {
                            for(let y = levelSize.y; y--;) {
                                const pos = vec2(x,levelSize.y-1-y);
                                const tileNum = layerData[y*levelSize.x + x];

                                if(tileNum == TILEMAP_LOOKUP.player) {
                                    createPlayerByEntity(pos.add(vec2(0,1)), vec2(0.6, 0.95), tile(TILEMAP_LOOKUP.player-1), world)
                                    continue
                                }

                                let data

                                if(tileNum < 1) {
                                    data = new TileLayerData(0, 0, false);
                                } else {
                                    // set the tile data
                                    setTileData(pos, i, tileNum);
                                    if(tileNum > 0 && tileNum <= TILETYPE.ladder) {
                                        setTileCollisionData(pos, tileNum)
                                    }
                                    
                                    data = new TileLayerData(tileNum - 1, 0, false);
                                }
                                
                                tileLay[i].setData(pos, data);
                            }
                        }

                        tileLay[i].redraw()
                        break
        
                    case "background":
                        break
                    
                    case "enemy":
                        break
                }
            }
        }
    })
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
        2, .2, .2, .1, .05,   // time, sizeStart, sizeEnd, speed, angleSpeed
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
engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost);