import Controller from "../Controller";
import { BufferGeometry, LineSegments, LineBasicMaterial, Vector3, BufferAttribute } from "three";

export default class TestLine extends Controller {
    start() {
        var material = new LineBasicMaterial({
            color: 0xff0000,
            linewidth: 10
        });

        let vertices = [
            new Vector3(0, 0.01, 0),
            new Vector3(2, 0.01, 0),
            new Vector3(4, 0.01, 0),
            new Vector3(6, 0.01, 0),
            new Vector3(8, 0.01, 0),
            new Vector3(10, 0.01, 0)
        ];
        
        var positions = new Float32Array(vertices.length * 3);
        
        for (var i = 0; i < vertices.length; i++) {
        
            positions[i * 3] = vertices[i].x;
            positions[i * 3 + 1] = vertices[i].y;
            positions[i * 3 + 2] = vertices[i].z;
        
        }
        
        let indices = [0, 1, 1, 2, 2, 3, 4, 5];
        
        var geometry = new BufferGeometry();
        geometry.addAttribute('position', new BufferAttribute(positions, 3));
        geometry.setIndex(new BufferAttribute(new Uint16Array(indices), 1));
        
        var line = new LineSegments(geometry, material);
        this.mesh.add(line)
    }
}