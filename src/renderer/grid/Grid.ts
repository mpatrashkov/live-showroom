import { Vector2, Vector3 } from "three"
import MathHelpers from "../utils/MathHelpers"

export default class Grid {
    size = new Vector2(15, 15)
    tileSize = 2
    worldSize = new Vector2()

    tiles: number[][] = []

    constructor() {
        this.worldSize = this.size.clone().multiplyScalar(this.tileSize)
        for(let i = 0; i < this.size.y; i++) {
            const row = []
            for(let j = 0; j < this.size.x; j++) {
                row.push(0)
            }
            this.tiles.push(row)
        }
    }

    isAreaInGrid(pos: Vector2, size: Vector2) {
        if(pos.x + size.x > this.size.x || pos.y + size.y > this.size.y) {
            return false
        }

        return true
    }

    getSafePosition(pos: Vector2, size: Vector2): Vector2 {
        const result = new Vector2().copy(pos)
        if(result.x < 0) {
            result.x = 0
        }
        else if(result.x > this.size.x - size.x) {
            result.x = this.size.x - size.x
        }

        if(result.y < 0) {
            result.y = 0
        }
        else if(result.y > this.size.y - size.y) {
            result.y = this.size.y - size.y
        }

        return result
    }

    isAreaFree(pos: Vector2, size: Vector2) {
        if(!this.isAreaInGrid(pos, size)) {
            return
        }
        
        for(let i = 0; i < size.y; i++) {
            for(let j = 0; j < size.x; j++) {
                if(this.tiles[pos.y + i][pos.x + j] !== 0) {
                    return false
                }
            }
        }

        return true
    }

    setArea(pos: Vector2, size: Vector2, val: number) {
        for(let i = 0; i < size.y; i++) {
            for(let j = 0; j < size.x; j++) {
                this.tiles[pos.y + i][pos.x + j] = val
            }
        }
    }

    rotateArea(pos: Vector2, size: Vector2) {
        const center = {
            x: Math.floor(size.x / 2),
            y: Math.floor(size.y / 2)
        }

        const z = center.x - center.y

        const newSize = new Vector2(size.y, size.x)
        const newPos = new Vector2(pos.x + z, pos.y - z)

        // this.setArea(newPos, newSize, 100)
        // console.table(this.tiles)

        return { pos: newPos, size: newSize }
    }

    // getArea(pos: Vector2) {
    //     let w = 0, h = 0

    //     if((pos.x > 0 && this.tiles[pos.x - 1][pos.y] !== 0) || 
    //        (pos.y > 0 && this.tiles[pos.x][pos.y - 1] !== 0)) {
    //         return null
    //     }

    //     for(let i = pos.x; i < this.size.x; i++) {
    //         if(this.tiles[i][pos.y] === 0) {
    //             break;
    //         }
    //         w++
    //     }

    //     for(let i = pos.y; i < this.size.y; i++) {
    //         if(this.tiles[pos.x][i] === 0) {
    //             break;
    //         }
    //         h++
    //     }

    //     if(w === 0 || h === 0) {
    //         return null
    //     }

    //     return {
    //         pos: pos.clone(),
    //         size: new Vector2(w, h)
    //     }
    // }

    // getAreas() {
    //     const areas = []

    //     for(let i = 0; i < this.size.y; i++) {
    //         for(let j = 0; j < this.size.x; j++) {
    //             const area = this.getArea(new Vector2(i, j))
    //             if(area) {
    //                 areas.push(area)
    //             }
    //         }
    //     }

    //     return areas
    // }

    getFreeSpot(size: Vector2) {
        for(let i = 0; i < this.size.y; i++) {
            for(let j = 0; j < this.size.x; j++) {
                if(this.isAreaFree(new Vector2(j, i), size)) {
                    this.setArea(new Vector2(j, i), size, 100)
                    return new Vector2(j, i)
                }
            }
        }
        console.log(1)
        return null
    }

    moveObject(prevPos: Vector2, pos: Vector2, size: Vector2) {
        this.setArea(prevPos, size, 0)
        this.setArea(pos, size, 100)
    }

    gridToWorldPosition(pos: Vector2) {
        return new Vector3(pos.x - Math.round(this.size.x / 2) + 1, 0, pos.y - Math.round(this.size.y / 2) + 1).multiplyScalar(this.tileSize)
    }

    worldToGridPosition(pos: Vector3) {
        const res = MathHelpers.roundVector(pos.clone().divideScalar(this.tileSize))
        return new Vector2(
            Math.round(res.x + this.size.x / 2) - 1,
            Math.round(res.z + this.size.y / 2) - 1,
        )
    }
}