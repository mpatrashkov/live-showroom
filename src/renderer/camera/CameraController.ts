import Controller from "../Controller";
import Entity from "../Entity";
import CameraOrbitController from "./CameraOrbitController";
import { Matrix4, Quaternion, Vector3 } from "three";
import Time from "../utils/Time";
import CameraMovementController from "./CameraMovementController";
import MathHelpers from "../utils/MathHelpers";
import CameraRotationController from "./CameraRotationController";
import EventSystem, { EventType } from "../utils/EventSystem";

export default class CameraController extends Controller {
    public orbitOffset = new Vector3(0, 5, 7);

    private cameraMovementController: CameraMovementController | null = null;
    private cameraOrbitController: CameraOrbitController | null = null;
    private cameraRotationController: CameraRotationController | null = null;

    public currentPitchAngle = 0;
    public maxPitchAngle = 65;
    public minPitchAngle = -65;

    private cameraStartingY = 5;

    private isPreparingForOrbiting = false;

    public isOrbiting = false;

    start() {
        this.maxPitchAngle = MathHelpers.toRad(this.maxPitchAngle);
        this.minPitchAngle = MathHelpers.toRad(this.minPitchAngle);
        const camera = Controller.mainCamera;

        this.cameraMovementController = this.entity.addController(CameraMovementController)
        this.cameraOrbitController = this.entity.addController(CameraOrbitController)
        this.cameraRotationController = this.entity.addController(CameraRotationController)
        this.cameraOrbitController.enabled = false;
        camera.position.y = this.cameraStartingY;
    }

    update() {
        Controller.mainCamera.quaternion.copy(this.transform.rotation);
    }

    private prepareCameraForOrbiting(target: Entity) {
        this.isPreparingForOrbiting = true;
        return new Promise((resolve, reject) => {
            let progress = 0;
            let targetPosition = target.transform.position.clone().add(this.orbitOffset);
            let startingPosition = Controller.mainCamera.position.clone();
            

            let rotationMatrix = new Matrix4();
            let targetRotation = new Quaternion();
            let newRotation = new Quaternion();
            let startingRotation = this.transform.rotation.clone();

            rotationMatrix.lookAt(targetPosition, target.transform.position, new Vector3(0, 1, 0));
            targetRotation.setFromRotationMatrix(rotationMatrix);

            this.onUpdate((clear) => {
                Controller.mainCamera.position.lerpVectors(startingPosition, targetPosition, progress);

                Quaternion.slerp(startingRotation, targetRotation, newRotation, progress);
                this.transform.rotation.set(newRotation.x, newRotation.y, newRotation.z, newRotation.w);

                progress += 1 * Time.deltaTime;

                if(progress >= 1) {
                    this.isPreparingForOrbiting = false;
                    clear();
                    resolve();
                }
            })
        })
    }

    public setTarget(target: Entity) {
        if(this.cameraMovementController) {
            this.cameraMovementController.enabled = false;
        }

        EventSystem.fire(EventType.OrbitableClicked, target.name);
        this.isOrbiting = true;

        this.prepareCameraForOrbiting(target).then(() => {
            if(this.cameraOrbitController) {
                this.cameraOrbitController.enabled = true;
                this.cameraOrbitController.target = target;

                if(this.cameraRotationController) {
                    this.cameraRotationController.enabled = false;
                }
            }
        });
    }

    public setPosition(point: Vector3) {
        if(this.isPreparingForOrbiting) {
            return;
        }

        point.y = this.cameraStartingY;


        if(this.cameraOrbitController) {
            this.cameraOrbitController.removeTransparentObjects();
            this.cameraOrbitController.enabled = false;
            if(this.cameraMovementController) {
                this.cameraMovementController.enabled = true;
            }
        }

        if(this.cameraMovementController) {
            EventSystem.fire(EventType.OrbitableClosed);
            this.isOrbiting = false;
            this.cameraMovementController.setPosition(point);
        }

        if(this.cameraRotationController) {
            this.cameraRotationController.enabled = true;
        }
    }
}
