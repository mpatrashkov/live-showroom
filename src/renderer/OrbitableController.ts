import Controller from "./Controller";
import CameraController from "./camera/CameraController";

export default class OrbitableController extends Controller {
    public cameraController: CameraController | null = null;

    onClick() {
        if(this.cameraController) {
            this.cameraController.setTarget(this.entity);
        }
    }
}