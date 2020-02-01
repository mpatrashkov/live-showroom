import Controller from "../Controller";
import Drag from "../utils/Drag";
import { Quaternion, Vector3 } from "three";
import CameraController from "./CameraController";

export default class CameraRotationController extends Controller {
    public sensitivity = 1 / 300;

    start() {
        const cameraController = this.entity.getController(CameraController);

        Drag.onDrag((deltaDrag) => {
            if(!this.enabled) {
                return;
            }

            let pitchAngle = deltaDrag.y * this.sensitivity;
            cameraController.currentPitchAngle += pitchAngle;

            let yawAngle = deltaDrag.x * this.sensitivity;
            if(cameraController.currentPitchAngle > cameraController.maxPitchAngle) {
                pitchAngle = 0;
                cameraController.currentPitchAngle = cameraController.maxPitchAngle;
            }
            else if(cameraController.currentPitchAngle < cameraController.minPitchAngle) {
                pitchAngle = 0;
                cameraController.currentPitchAngle = cameraController.minPitchAngle;
            }

            const pitch = new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), pitchAngle); // X
            const yaw = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), yawAngle); // Y
            const roll = this.transform.rotation.clone(); // Z
            
            const newRotation = yaw.multiply(roll.multiply(pitch));
            this.transform.rotation.copy(newRotation);
        })
    }
}