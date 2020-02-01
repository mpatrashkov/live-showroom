import Controller from "./Controller";
import CameraController from "./camera/CameraController";
import { Vector3 } from "three";
import Drag from "./utils/Drag";
import Raycast from "./utils/Raycast";
import Input from "./utils/Input";
import Outline from "./utils/Outline";

export default class OrbitableController extends Controller {
    public cameraController: CameraController | null = null;

    update() {
        if(!Drag.isDragging && !this.cameraController.isOrbiting && Raycast.fromCamera(Input.mousePosition, [this.entity])) {
            Outline.outlineSingleEntity(this.entity);
        }
        else {
            Outline.removeOutline(this.entity);
        }
    }

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