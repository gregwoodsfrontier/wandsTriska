import { TileLayer, TileLayerData, Vector2, initTileCollision, setTileCollisionData, tile, tileCollisionSize, vec2 } from "littlejsengine";
import { createPlayerByEntity } from "./player";
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
export const tileLay = [] as TileLayer[]

export enum TILETYPE {
    break = 2,
    solid = 3,
    ladder = 4
}

export enum TILEMAP_LOOKUP {
    player = 10,
    demon = 15,
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
                switch (tm.layers[i].name){
                    case "foreground": 
                        let layerData = tm.layers[i].data
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
                                    setTileData(pos, tileData, i, tileNum);
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
                        console.log(tm.layers[i].objects) // Array
                        break
                }
            }
        }
    })
}