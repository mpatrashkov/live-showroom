import Controller from "./Controller";
import { BoxGeometry, MeshBasicMaterial, TextureLoader } from "three";

export default class CubeController extends Controller {
    public geometry: BoxGeometry | null = null;

    start() {
        const texture = new TextureLoader().load("https://threejsfundamentals.org/threejs/resources/images/checker.png");
        
        this.geometry = new BoxGeometry( 1, 1, 1 );
        const material = new MeshBasicMaterial({
            map: texture,
        });
        this.mesh.geometry = this.geometry;
        this.mesh.material = material;
    }

    update() {
        
    }
}