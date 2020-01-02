import Controller from "./Controller";
import { BoxGeometry, MeshBasicMaterial, Mesh, Euler, TextureLoader, EdgesGeometry, LineBasicMaterial, LineSegments } from "three";
import Time from "./utils/Time";
import CameraController from "./CameraController";

export default class CubeController extends Controller {
    private rotationSpeed = 0.1;
    public cameraController: CameraController | null = null;
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

    onClick() {
        if(this.cameraController) {
            this.cameraController.setTarget(this.transform.position);
        }
    }
}