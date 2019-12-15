import Controller from "./Controller";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default class CameraController extends Controller {
    orbitControls: OrbitControls | null = null;

    start() {
        this.orbitControls = new OrbitControls(Controller.mainCamera, Controller.renderer.domElement);
        this.orbitControls.autoRotate = true;
    }

    update() {
        this.orbitControls?.update();
    }
}