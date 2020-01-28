import Controller from "../Controller";
import Drag from "../utils/Drag";
import { Quaternion, Euler, Vector3, Camera } from "three";
import MathHelpers from "../utils/MathHelpers";

export default class CameraRotationController extends Controller {
    public sensitivity = 1 / 300;
    public maxPitchAngle = 60;
    public minPitchAngle = -30;

    start() {
        this.maxPitchAngle = MathHelpers.toRad(this.maxPitchAngle);
        this.minPitchAngle = MathHelpers.toRad(this.minPitchAngle);

        const camera = Controller.mainCamera;
        Drag.onDrag((deltaDrag) => {
            if(!this.enabled) {
                return;
            }

            let rotationX = camera.rotation.x;

            let pitchAngle = deltaDrag.y * this.sensitivity;
            rotationX += pitchAngle;

            let yawAngle = deltaDrag.x * this.sensitivity;

            if(rotationX > this.maxPitchAngle) {
                pitchAngle = 0;
            }
            else if(rotationX < this.minPitchAngle) {
                pitchAngle = 0;
            }

            const pitch = new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), pitchAngle); // X
            const yaw = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), yawAngle); // Y
            const roll = camera.quaternion.clone(); // Z
            
            camera.quaternion.copy(yaw.multiply(roll.multiply(pitch)))
        })
    }
}