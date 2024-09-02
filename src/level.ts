import { EngineObject, TileLayer, TileLayerData, Vector2, getTileCollisionData, initTileCollision, setTileCollisionData, tile, tileCollisionSize, vec2 } from "littlejsengine";

export const setTileData = (pos: Vector2, tileData: (number|undefined)[], data: number|undefined)=>
    pos.arrayCheck(tileCollisionSize) && (tileData[(pos.y|0)*tileCollisionSize.x+pos.x|0] = data);

export const getTileData = (pos: Vector2, tileData: (number|undefined)[])=>
    pos.arrayCheck(tileCollisionSize) ? tileData[(pos.y|0)*tileCollisionSize.x+pos.x|0]: 0;

export const tileData = [] as number[][]
export const tileLayers = [] as TileLayer[]

export let tileData2 = [] as (number|undefined)[]

export enum TILEMAP_LOOKUP {
    BREAK,
    LADDER,
    BLOCK,
    DOOR,
    BUSH = 7,
    KEY,
    WIZARD
}

export const loadLevel2 = (_data: (number|undefined)[], _tileLayers: TileLayer[] = tileLayers) => {
    const levelSize = vec2(30, 50)
    initTileCollision(levelSize)
    _tileLayers.push(new TileLayer(vec2(), levelSize, tile(0,16)))
    tileData2 = _data.slice()

    for(let x = levelSize.x; x--;) {
        for(let y = levelSize.y; y--;) {
            const posT = vec2(x, levelSize.y-1-y);
            const tileNum = _data[y*levelSize.x + x];
            if(!tileNum) continue
            if(tileNum == TILEMAP_LOOKUP.WIZARD) {
                const p = new EngineObject(posT.add(vec2(0,1)), vec2(0.6, 0.95), tile(tileNum-1))
                p.setCollision(true, true)
                // createPlayer(posT.add(vec2(0,1)), vec2(0.6, 0.95), tile(tileNum-1), world)
                continue
            }
            setTileCollisionData(posT, tileNum)
            const newData = new TileLayerData(tileNum - 1, 0, false)
            _tileLayers[0].setData(posT, newData)
        }
    }
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