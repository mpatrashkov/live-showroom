import Controller from "../Controller";
import DesignCameraOrbitingController from "./DesignCameraOrbitingController";
import { Vector3 } from "three";

export default class DesignCameraController extends Controller {
    private cameraStartingY = 20;

    public currentPitchAngle = 0;
    public maxPitchAngle = 65;
    public minPitchAngle = -65;

    start() {
        const camera = Controller.mainCamera;
        camera.position.y = this.cameraStartingY;

        const cameraOrbitController = this.entity.addController(DesignCameraOrbitingController)
        cameraOrbitController.targetPostion = new Vector3(0, 0, 0)
    }

    update() {
        Controller.mainCamera.quaternion.copy(this.transform.rotation);
    }
}