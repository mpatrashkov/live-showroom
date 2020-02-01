import Controller from "./Controller";
import CameraController from "./camera/CameraController";
import { Vector3 } from "three";
import Drag from "./utils/Drag";

export default class OrbitableController extends Controller {
    public cameraController: CameraController | null = null;

    onMouseDown() {
        if(this.cameraController) {
            Drag.startDragCheck();
        }
    }

    onMouseUp(point: Vector3) {
        if(this.cameraController && !Drag.checkDrag()) {
            this.cameraController.setTarget(this.entity);
        }
    }
}