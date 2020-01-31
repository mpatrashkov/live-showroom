import Controller from "./Controller";
import { CircleGeometry, MeshBasicMaterial, Mesh } from "three";

export default class CircleController extends Controller {
    start() {
        this.mesh.geometry = new CircleGeometry(1, 30);
        this.mesh.material = new MeshBasicMaterial( { color: 0xFFFFFF, transparent: true, opacity: 0.5 } );
    }
}