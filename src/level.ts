import { TileLayer, TileLayerData, Vector2, getTileCollisionData, initTileCollision, randInt, setTileCollisionData, tile, tileCollisionSize, vec2 } from "littlejsengine";
import { spawnSpikeBall, tileLayers, tileData2, TILEMAP_LOOKUP, maxAddHeight, playerGroup, gameData, createPlayer } from "./global";
import { makeDeb, PALLETE, SE } from "./effects";

export let doorCoord = vec2()

export const setTileData = (pos: Vector2, tileData: (number|undefined)[], data: number|undefined)=>
    pos.arrayCheck(tileCollisionSize) && (tileData[(pos.y|0)*tileCollisionSize.x+pos.x|0] = data);

export const getTileData = (pos: Vector2, tileData: (number|undefined)[])=>
    pos.arrayCheck(tileCollisionSize) ? tileData[(pos.y|0)*tileCollisionSize.x+pos.x|0]: 0;

export const loadLevel = (_data: (number|undefined)[], _tileLayers: TileLayer[] = tileLayers, _tileData = tileData2) => {
    // need to set the level size first.
    const levelSize = vec2(30, 10+maxAddHeight)
    initTileCollision(levelSize)
    _tileLayers.push(new TileLayer(vec2(), levelSize, tile(0,16)))
    for(let i = 0; i < _data.length; i++) {
        _tileData.push(_data[i])
    }

    for(let x = levelSize.x; x--;) {
        for(let y = levelSize.y; y--;) {
            const posT = vec2(x, levelSize.y-1-y);
            const tileNum = _data[y*levelSize.x + x];
            if(!tileNum) continue
            if(tileNum == TILEMAP_LOOKUP.WIZARD) {
                gameData.playerStartPos = posT.add(vec2(0,1))
                const p = createPlayer(gameData.playerStartPos)
                if(playerGroup.length === 0) {playerGroup.push(p)}
                continue
            }
            else if(tileNum == TILEMAP_LOOKUP.SPIKEBALL) {
                spawnSpikeBall(posT.add(vec2(0,1)))
                continue
            }
            setTileCollisionData(posT, tileNum)
            const newData = new TileLayerData(tileNum - 1, 0, false)
            _tileLayers[0].setData(posT, newData)
        }
    }

    _tileLayers[0].redraw()
    

    for(let i = 0; i < maxAddHeight - 1; i++) {
        if(i === maxAddHeight - 2) {
            addRandomRowTile(i, 0, true, false)
        } else if (i === maxAddHeight - 3) {
            addRandomRowTile(i, 0, false, true)
        } else {
            const rando = randInt(10, 25)
            addRandomRowTile(i, rando, false, false)
        }
    }
    _tileLayers[0].renderOrder = 1000
}

export const addTile = (_pos: Vector2, _tileNum: number, _tileLayers = tileLayers, _tileData = tileData2) => {
    _pos = _pos.floor()
    const layer = _tileLayers[0]
    _tileLayers[0].redrawStart(false)
    layer.setData(_pos, new TileLayerData(_tileNum-1), true)
    setTileData(_pos, _tileData, _tileNum)
    setTileCollisionData(_pos, _tileNum)
    _tileLayers[0].redrawEnd()
}

export const addRandomRowTile = (_addedRows: number, _probBl: number, _allBlk: boolean, _doorRow: boolean) => {
    // tileLayers[0].redrawStart()
    if(_probBl<0 || _probBl>100) throw new Error("probability of block tiles should be within 0 and 100")
    if(_allBlk && _doorRow) throw new Error("all block setting and door row should not be both true.")
    let doorNum = 0
    if(_doorRow) {
        doorNum = randInt(0, tileCollisionSize.x-1)
        doorCoord = doorCoord.add(vec2(doorNum, maxAddHeight - 3))
    }
    for(let i = 0; i < tileCollisionSize.x; i++) {
        let pos = vec2(i, maxAddHeight - _addedRows)
        if(i == 0 || i == tileCollisionSize.x-1) {
            addTile(pos, TILEMAP_LOOKUP.BLOCK)
        } else {
            if(_allBlk) {
                addTile(pos, TILEMAP_LOOKUP.BLOCK)
            } else if (_doorRow) {
                if(i == doorNum) {
                    addTile(pos, TILEMAP_LOOKUP.DOOR)
                } else {
                    addTile(pos, TILEMAP_LOOKUP.BREAK)
                }
            } else {
                const rand = randInt(0, 100)
                if(rand>0 && rand<_probBl) {
                    addTile(pos, TILEMAP_LOOKUP.BLOCK)
                } else {
                    addTile(pos, TILEMAP_LOOKUP.BREAK)
                }
            }
        }
    }
}

export const addRowTile = (_addedRows: number) => {
    for(let i = 0; i < tileCollisionSize.x; i++) {
        let pos = vec2(i, maxAddHeight - _addedRows)
        if(i == 0 || i == tileCollisionSize.x-1) {
            addTile(pos, TILEMAP_LOOKUP.BLOCK)
        } else {
            addTile(pos, TILEMAP_LOOKUP.BREAK)
        }
    }
}

export const destroyTile = (_pos: Vector2, _tileLayers = tileLayers, _tileData = tileData2) => {
    _pos = _pos.floor()

    // destroy tile
    const tileNum = getTileCollisionData(_pos);
    if (!tileNum) return false;

    // check foreground index. hard codiing it.
    const layer =_tileLayers[0]
   if(tileNum == TILEMAP_LOOKUP.BREAK) {
        // set and clear tile
        layer.setData(_pos, new TileLayerData, true);
        setTileCollisionData(_pos, 0);
        setTileData(_pos, _tileData, undefined);

        SE.TILE_EXPLODE.play()
        makeDeb(_pos, PALLETE.YELLOW)

        return true
   } else if (tileNum == TILEMAP_LOOKUP.KEY) {
        layer.setData(_pos, new TileLayerData, true);
        setTileCollisionData(_pos, 0);
        setTileData(_pos, _tileData, undefined);
   }

   return false
}