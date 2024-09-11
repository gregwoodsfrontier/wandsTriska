// holds all my global variables and costants in 1 file

import { Timer, Vector2, drawRect, vec2, overlayCanvas, hsl, overlayContext, drawTextScreen, TileLayer } from "littlejsengine"
import SpikeBall from "./spikeBall"

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

export const incrementTotSteps = (_totSteps: number) => {
    return _totSteps + 1
}

export const createGameOverOverlay = () => {
    drawRect(vec2(overlayCanvas.width/2, overlayCanvas.height/2), vec2(500, 300), hsl(0, 0, 0.5, 1), 0, false, true, overlayContext)
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

export const tileLayers = [] as TileLayer[]

export const tileData2 = [] as (number|undefined)[]

export const maxAddHeight = 30

export enum TILEMAP_LOOKUP {
    BREAK = 1,
    BLOCK,
    DOOR,
    KEY = 5,
    WIZARD,
    FIRE,
    SPIKEBALL
}