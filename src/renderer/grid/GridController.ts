import Controller from "../Controller";
import { LineBasicMaterial, Vector3, BufferGeometry, BufferAttribute, LineSegments, Vector2, Object3D, PlaneBufferGeometry, MeshBasicMaterial, Mesh, DoubleSide, Euler, Line } from "three";
import Grid from "./Grid";

export default class GridController extends Controller {
    grid: Grid

    private vertices: Vector3[] = []
    private indices: number[] = []

    private showSquares = false
    private squares: Object3D[][] = []

    private squareMaterial = new MeshBasicMaterial({ color: 0xffff00, side: DoubleSide });
    private squareGeometry

    start() {
        this.grid = new Grid()
        this.squareGeometry = new PlaneBufferGeometry(this.grid.tileSize, this.grid.tileSize, 1)

        const material = new LineBasicMaterial({
            color: 0x0000ff
        })

        for(let i = 0; i < this.grid.worldSize.y / 2 + 1; i++) {
            this.addLine("horizontal", i)
        }

        for(let i = 0; i < this.grid.worldSize.x / 2 + 1; i++) {
            this.addLine("vertical", i)
        }

        const positions = new Float32Array(this.vertices.length * 3);
        
        for (let i = 0; i < this.vertices.length; i++) {
            positions[i * 3] = this.vertices[i].x;
            positions[i * 3 + 1] = this.vertices[i].y;
            positions[i * 3 + 2] = this.vertices[i].z;        
        }

        var geometry = new BufferGeometry();
        geometry.addAttribute('position', new BufferAttribute(positions, 3));
        geometry.setIndex(new BufferAttribute(new Uint16Array(this.indices), 1));
        
        var line = new LineSegments(geometry, material);
        this.mesh.add(line)

        // this.addSquare(1, 1)
    }

    addLine(orientation: "horizontal" | "vertical", offset: number) {
        this.indices.push(
            this.vertices.length,
            this.vertices.length + 1,
        )

        const gridOffsetX = this.grid.worldSize.x / 2
        const gridOffsetY = this.grid.worldSize.y / 2
        const y = 0.05

        if(orientation === "horizontal") {
            this.vertices.push(
                new Vector3(-gridOffsetX, y, offset * 2 - gridOffsetY),
                new Vector3(+gridOffsetX, y, offset * 2 - gridOffsetY)
            )
        }
        else {
            this.vertices.push(
                new Vector3(offset * 2 - gridOffsetX, y, -gridOffsetY),
                new Vector3(offset * 2 - gridOffsetX, y, +gridOffsetY)
            )
        }
    }

    toggleSquares(state?: boolean) {
        if(state === undefined) {
            state = !this.showSquares
        }

        this.showSquares = state

        if(state) {
            for(let y = 0; y < this.grid.size.y; y++) {
                const squareRow = []
                for(let x = 0; x < this.grid.size.x; x++) {
                    if(this.grid.tiles[y][x] !== 0) {
                        squareRow.push(this.addSquare(x, y))
                    }
                }
                this.squares.push(squareRow)
            }
        }
        else {
            for(let row of this.squares) {
                for(let col of row) {
                    Controller.scene.remove(col)
                }
            }
            this.squares = []
        }
    }

    addSquare(x, y, w = 1, h = 1): Object3D {
        const plane = new Mesh(this.squareGeometry, this.squareMaterial)
        plane.position.copy(this.grid.gridToWorldPosition(new Vector2(x + (w - 1) / 2, y + (h - 1) / 2)))
        plane.position.copy(this.grid.gridToWorldPosition(new Vector2(x, y)))

        plane.position.setY(0.03)
        plane.rotation.copy(new Euler(-Math.PI / 2, 0, 0))

        plane.scale.set(w, h, 1)

        Controller.scene.add(plane)
        return plane
    }
}