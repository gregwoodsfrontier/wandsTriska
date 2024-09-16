// holds all my global variables and costants in 1 file

import { Timer, Vector2, drawRect, vec2, overlayCanvas, hsl, overlayContext, drawTextScreen, TileLayer, randSign, tile } from "littlejsengine"
import SpikeBall from "./spikeBall"
import Player from "./player"
import { addTile, setTileData } from "./level"

// holds the game state and relevant game data
export const gameData = {
    numOfSpikeBalls: 0,
    totalSteps: 0,
    isPlaying: true,
    isGameOver: false,
    isWin: false,
    gameOverTimer: new Timer(),
    gOverTime: .9,
    playerStartPos: vec2(),
    keyPos: vec2()
}

export const playerGroup = [] as Player[]

export const setPlayingGame = () => {
    gameData.isGameOver = false
    gameData.isPlaying = true
    gameData.isWin = false
    if(gameData.gameOverTimer.isSet()) {
        gameData.gameOverTimer.unset()
    }
}

export const setGameOver = (_isWin: boolean) => {
    gameData.isGameOver = true
    gameData.isPlaying = false
    gameData.isWin = _isWin
    gameData.gameOverTimer.set(gameData.gOverTime)
}

export const createPlayer = (_pos: Vector2) => {
    return new Player(_pos, vec2(0.6, 0.8), tile(TILEMAP_LOOKUP.WIZARD-1))
}

export const createKey = (_pos: Vector2) => {
    addTile(_pos, TILEMAP_LOOKUP.KEY)
}

export const spawnSpikeBall = (_pos: Vector2) => {
    const sB = new SpikeBall(_pos)
    sB.velocity = vec2(1, randSign()*1).normalize(0.5)

    gameData.numOfSpikeBalls++
}

export const incrementTotSteps = (_totSteps: number) => {
    return _totSteps + 1
}

export const createGameOverOverlay = () => {
    drawRect(vec2(overlayCanvas.width/2, overlayCanvas.height/2), vec2(500, 300), hsl(0, 0, 0.5, 1), 0, false, true, overlayContext)
    
    const overlayText = gameData.isWin? 'YOU WIN !!!': 'TRY AGAIN!!!'
    drawTextScreen(overlayText, vec2(overlayCanvas.width/2, overlayCanvas.height/2), 40, hsl(0, 0, 1, 1), 3, hsl(0, 0, 0, 1), 'center', '12px arial' ,overlayContext)
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