import Controller from "./Controller";
import { BoxGeometry, MeshBasicMaterial, Mesh, Euler, Vector2 } from "three";
import Time from "./utils/Time";

export default class CubeController extends Controller {
    private rotationSpeed = 0.1;

    start() {
        const geometry = new BoxGeometry( 1, 1, 1 );
        const material = new MeshBasicMaterial( { color: 0x00ff00 } );
        this.mesh.geometry = geometry;
        this.mesh.material = material;
    }

    update() {
        
    }

    onClick() {
        console.log(1);
    }
}