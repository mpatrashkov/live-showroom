import Controller from "../Controller";
import Entity from "../Entity";
import CameraOrbitController from "./CameraOrbitController";
import { Matrix4, Quaternion, Vector3 } from "three";
import Time from "../utils/Time";
import CameraMovementController from "./CameraMovementController";

export default class CameraController extends Controller {
    public orbitOffset = new Vector3(0, 1, 2);

    private cameraMovementController: CameraMovementController | null = null;
    private cameraOrbitController: CameraOrbitController | null = null;

    start() {
        this.cameraMovementController = this.entity.addController(CameraMovementController)
        this.cameraOrbitController = this.entity.addController(CameraOrbitController)
        this.cameraOrbitController.enabled = false;
    }

    private prepareCameraForOrbiting(target: Entity) {
        return new Promise((resolve, reject) => {
            let progress = 0;
            let targetPosition = target.transform.position.clone().add(this.orbitOffset);
            let startingPosition = Controller.mainCamera.position.clone();

            let rotationMatrix = new Matrix4();
            let targetRotation = new Quaternion();
            let newRotation = new Quaternion();
            let startingRotation = Controller.mainCamera.quaternion.clone();

            rotationMatrix.lookAt(targetPosition, target.transform.position, new Vector3(0, 1, 0));
            targetRotation.setFromRotationMatrix(rotationMatrix);

            this.onUpdate((clear) => {
                Controller.mainCamera.position.lerpVectors(startingPosition, targetPosition, progress);

                Quaternion.slerp(startingRotation, targetRotation, newRotation, progress);
                Controller.mainCamera.quaternion.set(newRotation.x, newRotation.y, newRotation.z, newRotation.w);

                progress += 1 * Time.deltaTime;

                if(progress >= 1) {
                    clear();
                    resolve();
                }
            })
        })
    }

    public setTarget(target: Entity) {
        this.prepareCameraForOrbiting(target).then(() => {
            if(this.cameraOrbitController) {
                this.cameraOrbitController.enabled = true;
                this.cameraOrbitController.target = target;
            }
        });
    }

    public setPosition(point: Vector3) {
        if(this.cameraOrbitController) {
            this.cameraOrbitController.enabled = false;
        }

        if(this.cameraMovementController) {
            this.cameraMovementController.setPosition(point);
        }
    }
}
