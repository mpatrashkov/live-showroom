import Controller from "./Controller";
import { BoxGeometry, MeshBasicMaterial } from "three";

export default class FloorController extends Controller {
    start() {
        const geometry = new BoxGeometry( 1, 1, 1 );
        const material = new MeshBasicMaterial( { color: 0x00ff00 } );
        this.mesh.geometry = geometry;
        this.mesh.material = material;
    }

    update() {

    }

    onClick() {
        console.log(2);
    }
}