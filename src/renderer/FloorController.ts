import Controller from "./Controller";
import { BoxGeometry, MeshBasicMaterial, PlaneGeometry, Euler } from "three";

export default class FloorController extends Controller {
    start() {
        const geometry = new PlaneGeometry(11,11);
        const material = new MeshBasicMaterial( { color: 0xaaffaa } );
        this.mesh.geometry = geometry;
        this.mesh.material = material;
        this.transform.eulerRotation = new Euler(-Math.PI/2,0,0)
    }

    update() {

    }

    onClick() {
        console.log(2);
    }
}