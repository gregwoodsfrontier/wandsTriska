import { TileLayer, TileLayerData, Vector2, initTileCollision, setTileCollisionData, tile, tileCollisionSize, vec2 } from "littlejsengine";
import { createPlayerByEntity as createPlayer } from "./player";
import { world } from "./game";

export const setTileData = (pos: Vector2, tileData: number[][], layer: number, data: number)=>
    pos.arrayCheck(tileCollisionSize) && (tileData[layer][(pos.y|0)*tileCollisionSize.x+pos.x|0] = data);

export const getTileData = (pos: Vector2, tileData: number[][], layer: number)=>
    pos.arrayCheck(tileCollisionSize) ? tileData[layer][(pos.y|0)*tileCollisionSize.x+pos.x|0]: 0;

async function getTileMapData(link: string) {
    const response = await fetch(link);
    const data = await response.json();

    return data;
}

export const tileData = [] as number[][]
export const tileLayers = [] as TileLayer[]

export enum TILETYPE {
    empty = 0,
    break = 1,
    solid = 2,
    ladder = 3,
    bush = 4
}

export enum TILEMAP_LOOKUP {
    bush = 7,
    block = 3,
    ladder = 2,
    door = 4,
    player = 9,
    demon = 10,
    blob = 11,
    tri = 12,
    spike = 13,
    fireball = 14
}

export const loadLevel = () => {
    getTileMapData("/gameLevelData.json").then((data) => {
        const tm = data

        console.log(`dataLayers: `, data.layers)
        let levelSize = vec2(tm.width, tm.height)
        initTileCollision(levelSize)
        // engineObjectsDestroy()

        if(tm.layers) {
            const layerCount = tm.layers.length
            for(let i = 0; i < layerCount; i++) {
                let layerData = tm.layers[i].data
                tileLayers[i] = new TileLayer(vec2(), levelSize, tile(0,16));
                tileData[i] = []
                for(let x = levelSize.x; x--;) {
                    for(let y = levelSize.y; y--;) {
                        const posT = vec2(x,levelSize.y-1-y);
                        const tileNum = layerData[y*levelSize.x + x];
                        let tiletype

                        if(tm.layers[i].name === "foreground") {
                            if(tileNum == TILEMAP_LOOKUP.player) {
                                createPlayer(posT.add(vec2(0,1)), vec2(0.6, 0.95), tile(TILEMAP_LOOKUP.player-1), world)
                                continue
                            }

                            setTileData(posT, tileData, i, tileNum);
                                
                            tiletype = TILETYPE.empty

                            if(tileNum > 0) {
                                tiletype = TILETYPE.break
                            }
                            if(tileNum == TILEMAP_LOOKUP.ladder) {
                                tiletype = TILETYPE.ladder
                            }
                            if(tileNum == TILEMAP_LOOKUP.block) {
                                tiletype = TILETYPE.solid
                            }

                            if(tiletype > 0) {
                                setTileCollisionData(posT, tiletype)
    
                                const data = new TileLayerData(tileNum - 1, 0, false)
                                tileLayers[i].setData(posT, data);
                            }
                        }

                        if(tm.layers[i].name === "background") {
                            setTileData(posT, tileData, i, tileNum);
                            tiletype = TILETYPE.empty
                            if(tileNum == TILEMAP_LOOKUP.bush) {
                                tiletype = TILETYPE.bush
                            }
                            if(tiletype > 0) {
                                const data = new TileLayerData(tileNum - 1, 0, false)
                                tileLayers[i].setData(posT, data);
                            }
                        }

                        if(tm.layers[i].name === "enemy") {
                            
                            // set the creation for your enemies

                            tiletype = TILETYPE.empty
                            if(tiletype > 0) {    
                                const data = new TileLayerData(tileNum - 1, 0, false)
                                tileLayers[i].setData(posT, data);
                            }
                        }

                        
                        
                    }
                }

                tileLayers[i].redraw()
                
            }
        }
        console.log('tileLayers: ',tileLayers)
        console.log('tileData: ',tileData)
    })

    
}