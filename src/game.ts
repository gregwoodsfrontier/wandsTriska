import {
    mainCanvasSize, engineInit, setShowSplashScreen,
    Sound, Medal, medalsInit,
    ParticleEmitter, tile,
    vec2,
    hsl,
    initTileCollision,
    TileLayer,
    TileLayerData,
    mainContext,
    textureInfos,
    randInt,
    randColor,
    setTileCollisionData,
    setCameraPos,
    setCameraScale,
    setGravity,
    mouseWasPressed,
    mousePos,
    mousePosScreen,
    drawRect,
    drawTile,
    drawTextScreen,
    EngineObject,
    engineObjectsDestroy,
    Vector2,
    overlayContext,
    overlayCanvas,
    tileCollisionSize
} from 'littlejsengine'

import { createWorld, addEntity, addComponent, query, World } from 'bitecs';

async function getTileMapData(link: string) {
    const response = await fetch(link);
    const data = await response.json();

    return data;
}

// Define components
// Components can be any storage you want, here it is an SoA
const Position = {
	x: [] as number[],
	y: [] as number[],
};

const EngineObjectComp = {
	value: [] as EngineObject[],
};

// Create a world
const world = createWorld();

// Add entities to the world
const entityA = addEntity(world);
const entityB = addEntity(world);

// Add components to entities
// Entity A gets a shape of [Position, Mass]
addComponent(world, Position, entityA);

// Entity B gets a shape of [Position]
addComponent(world, Position, entityB);

// Set the initial values for Entity A's Position and Mass components
Position.x[entityA] = 400;
Position.y[entityA] = 200;

// Set the initial values for Entity B's Position component
Position.x[entityB] = 600;
Position.y[entityB] = 300;

// Define a system that moves entities with a Position component
const moveBody = (world: World) => {
	const entities = query(world, [Position]); // Returns [entityA, entityB]

	for (const entity of entities) {
		Position.x[entity] += 1;
		Position.y[entity] += 1;
	}
};

// Run systems in a loop
const mainLoop = () => {
	moveBody(world);
};

// show the LittleJS splash screen
setShowSplashScreen(true);

// sound effects
const sound_click = new Sound([1,.5]);

// medals

// game variables
let particleEmitter: ParticleEmitter;

let levelSize: Vector2

const tileData = [] as number[][]
const tileLay = [] as TileLayer[]

const setTileData = (pos: Vector2, layer: number, data: number)=>
    pos.arrayCheck(tileCollisionSize) && (tileData[layer][(pos.y|0)*tileCollisionSize.x+pos.x|0] = data);
const getTileData = (pos: Vector2, layer: number)=>
    pos.arrayCheck(tileCollisionSize) ? tileData[layer][(pos.y|0)*tileCollisionSize.x+pos.x|0]: 0;


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
                                const tile = layerData[y*levelSize.x + x];
                                let data

                                // set the tile data
                                setTileData(pos, i, tile);

                                let direction = 0;
                                let mirror = false;

                                if(tile < 1) {
                                    data = new TileLayerData(0, direction, mirror);
                                } else {
                                    data = new TileLayerData(tile - 1, direction, mirror);
                                }
                                
                                tileLay[i].setData(pos, data);
                            }
                        }

                        console.table(tileData)
                        console.log(tileData[1].length)
                        console.table(tileLay)

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

///////////////////////////////////////////////////////////////////////////////
function gameInit()
{
    
    // // create tile collision and visible tile layer
    // const tileCollisionSize = vec2(32, 16);
    // initTileCollision(tileCollisionSize);
    // const pos = vec2();
    // const tileLayer = new TileLayer(pos, tileCollisionSize);

    // // get level data from the tiles image
    // // const mainContext = mainContext;
    // const tileImage = textureInfos[0].image;
    // mainContext.drawImage(tileImage, 0, 0);
    // const imageData = mainContext.getImageData(0,0,tileImage.width,tileImage.height).data;
    // for (pos.x = tileCollisionSize.x; pos.x--;)
    // for (pos.y = tileCollisionSize.y; pos.y--;)
    // {
    //     // check if this pixel is set
    //     const i = pos.x + tileImage.width*(15 + tileCollisionSize.y - pos.y);
    //     if (!imageData[4*i])
    //         continue;
        
    //     // set tile data
    //     const tileIndex = 1;
    //     const direction = randInt(4)
    //     const mirror = !randInt(2);
    //     const color = randColor();
    //     const data = new TileLayerData(tileIndex, direction, mirror, color);
    //     tileLayer.setData(pos, data);
    //     setTileCollisionData(pos, 1);
    // }

    // // draw tile layer with new data
    // tileLayer.redraw();

    // // move camera to center of collision
    setCameraPos(vec2(15, 10));
    setCameraScale(24);

    // enable gravity
    setGravity(-.01);

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

    loadLevel()

    console.log(particleEmitter)
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdate()
{
    if (mouseWasPressed(0))
    {
        // play sound when mouse is pressed
        sound_click.play(mousePos);

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

}

///////////////////////////////////////////////////////////////////////////////
function gameRender()
{
    // draw a grey square in the background without using webgl
    drawRect(vec2(16,8), vec2(20,14), hsl(0,0,.6), 0, false);
    
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
        drawText('Score: 0' ,   overlayCanvas.width*1/4, 20);
        drawText('Deaths: 0', overlayCanvas.width*3/4, 20);
    
}

///////////////////////////////////////////////////////////////////////////////
// Startup LittleJS Engine
engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost);