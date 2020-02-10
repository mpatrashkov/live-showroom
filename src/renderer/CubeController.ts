import Controller from "./Controller";
import { BoxGeometry, MeshBasicMaterial, TextureLoader } from "three";

export default class CubeController extends Controller {
    public geometry: BoxGeometry | null = null;

    start() {
        this.geometry = new BoxGeometry(1, 1, 1);
        this.mesh.geometry = this.geometry;
    }
}