import Controller from "../Controller";
import { LineBasicMaterial, Vector3, BufferGeometry, BufferAttribute, LineSegments, Vector2 } from "three";

export default class GridController extends Controller {
    gridSize = new Vector2(30, 30)
    gridStep = 2

    private vertices: Vector3[] = []
    private indices: number[] = []

    start() {
        const material = new LineBasicMaterial({
            color: 0x0000ff
        })

        for(let i = 0; i < this.gridSize.y / 2 + 1; i++) {
            this.addLine("horizontal", i)
        }

        for(let i = 0; i < this.gridSize.x / 2 + 1; i++) {
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
    }

    addLine(orientation: "horizontal" | "vertical", offset: number) {
        this.indices.push(
            this.vertices.length,
            this.vertices.length + 1,
        )

        const gridOffsetX = this.gridSize.x / 2
        const gridOffsetY = this.gridSize.y / 2
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
}