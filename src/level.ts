import { EngineObject, TileLayer, TileLayerData, Vector2, getTileCollisionData, initTileCollision, setTileCollisionData, tile, tileCollisionSize, vec2 } from "littlejsengine";
import Player from "./player";

export const setTileData = (pos: Vector2, tileData: (number|undefined)[], data: number|undefined)=>
    pos.arrayCheck(tileCollisionSize) && (tileData[(pos.y|0)*tileCollisionSize.x+pos.x|0] = data);

export const getTileData = (pos: Vector2, tileData: (number|undefined)[])=>
    pos.arrayCheck(tileCollisionSize) ? tileData[(pos.y|0)*tileCollisionSize.x+pos.x|0]: 0;

export const tileLayers = [] as TileLayer[]

export let tileData2 = [] as (number|undefined)[]

export enum TILEMAP_LOOKUP {
    BREAK = 1,
    BLOCK,
    DOOR,
    KEY = 5,
    WIZARD
}

export const loadLevel = (_data: (number|undefined)[],  _ent: EngineObject[], _tileLayers: TileLayer[] = tileLayers, _tileData = tileData2) => {
    const levelSize = vec2(30, 10)
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
                const p = new Player(posT.add(vec2(0,1)), vec2(0.6, 0.95), tile(tileNum-1))
                _ent.push(p)
                // createPlayer(posT.add(vec2(0,1)), vec2(0.6, 0.95), tile(tileNum-1), world)
                continue
            }
            setTileCollisionData(posT, tileNum)
            const newData = new TileLayerData(tileNum - 1, 0, false)
            _tileLayers[0].setData(posT, newData)
        }
    }
    _tileLayers[0].redraw()
    _tileLayers[0].renderOrder = 1e3
}

export const addTile = (_pos: Vector2, _tileNum: number, _tileLayers = tileLayers, _tileData = tileData2) => {
    _pos = _pos.floor()
    const layer = _tileLayers[0]
    layer.setData(_pos, new TileLayerData(_tileNum-1), true)
    setTileData(_pos, _tileData, _tileNum)
    setTileCollisionData(_pos, _tileNum)
    _tileLayers[0].redraw()
}

export const destroyTile = (_pos: Vector2, _tileLayers: TileLayer[], _tileData: (number|undefined)[]) => {
    _pos = _pos.floor()

    // destroy tile
    const tileNum = getTileCollisionData(_pos);
    if (!tileNum) return false;

    // checl foreground index. hard codiing it.
    const foreGIdx = 0
    const layer =_tileLayers[foreGIdx]
   if(tileNum == TILEMAP_LOOKUP.BREAK) {
        // set and clear tile
        layer.setData(_pos, new TileLayerData, true);
        setTileCollisionData(_pos, 0);
        setTileData(_pos, _tileData, undefined);

        return true
   }

   return false
}