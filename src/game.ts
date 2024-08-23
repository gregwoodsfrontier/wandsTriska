/*
    Little JS TypeScript Demo
    - A simple starter project
    - Shows how to use LittleJS with TypeScript
*/

'use strict';

// import module
// import * as LittleJS from 'littlejsengine';
// const {tile, vec2, hsl} = LittleJS;

import {
    mainCanvasSize,
    engineInit,
    setShowSplashScreen,
    Sound,
    Medal,
    medalsInit,
    ParticleEmitter,
    tile,
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
    drawTextScreen
} from 'littlejsengine'

// show the LittleJS splash screen
setShowSplashScreen(true);

// sound effects
const sound_click = new Sound([1,.5]);

// medals
const medal_example = new Medal(0, 'Example Medal', 'Welcome to LittleJS!');
medalsInit('Hello World');

// game variables
let particleEmitter: ParticleEmitter;

///////////////////////////////////////////////////////////////////////////////
function gameInit()
{
    // create tile collision and visible tile layer
    const tileCollisionSize = vec2(32, 16);
    initTileCollision(tileCollisionSize);
    const pos = vec2();
    const tileLayer = new TileLayer(pos, tileCollisionSize);

    // get level data from the tiles image
    // const mainContext = mainContext;
    const tileImage = textureInfos[0].image;
    mainContext.drawImage(tileImage, 0, 0);
    const imageData = mainContext.getImageData(0,0,tileImage.width,tileImage.height).data;
    for (pos.x = tileCollisionSize.x; pos.x--;)
    for (pos.y = tileCollisionSize.y; pos.y--;)
    {
        // check if this pixel is set
        const i = pos.x + tileImage.width*(15 + tileCollisionSize.y - pos.y);
        if (!imageData[4*i])
            continue;
        
        // set tile data
        const tileIndex = 1;
        const direction = randInt(4)
        const mirror = !randInt(2);
        const color = randColor();
        const data = new TileLayerData(tileIndex, direction, mirror, color);
        tileLayer.setData(pos, data);
        setTileCollisionData(pos, 1);
    }

    // draw tile layer with new data
    tileLayer.redraw();

    // move camera to center of collision
    setCameraPos(tileCollisionSize.scale(.5));
    setCameraScale(48);

    // enable gravity
    setGravity(-.01);

    // create particle emitter
    particleEmitter = new ParticleEmitter(
        vec2(16,9), 0,              // emitPos, emitAngle
        1, 0, 500, Math.PI,         // emitSize, emitTime, emitRate, emiteCone
        tile(0, 16),                // tileIndex, tileSize
        hsl(1,1,1),   hsl(0,0,0),   // colorStartA, colorStartB
        hsl(0,0,0,0), hsl(0,0,0,0), // colorEndA, colorEndB
        2, .2, .2, .1, .05,   // time, sizeStart, sizeEnd, speed, angleSpeed
        .99, 1, 1, Math.PI,   // damping, angleDamping, gravityScale, cone
        .05, .5, true, true   // fadeRate, randomness, collide, additive
    );
    particleEmitter.elasticity = .3; // bounce when it collides
    particleEmitter.trailScale = 2;  // stretch in direction of motion
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

        // unlock medals
        medal_example.unlock();
    }

    // move particles to mouse location if on screen
    if (mousePosScreen.x)
        particleEmitter.pos = mousePos;
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
    
    // draw the logo as a tile
    drawTile(vec2(21,5), vec2(4.5), tile(3,128));
}

///////////////////////////////////////////////////////////////////////////////
function gameRenderPost()
{
    // draw to overlay canvas for hud rendering
    drawTextScreen('LittleJS with TypeScript', vec2(mainCanvasSize.x/2, 80), 80);
}

///////////////////////////////////////////////////////////////////////////////
// Startup LittleJS Engine
engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost);