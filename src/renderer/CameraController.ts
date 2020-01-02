import Controller from "./Controller";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Vector3, Matrix4, Quaternion, Euler } from "three";
import Time from "./utils/Time";
import {TrackballControls} from "three/examples/jsm/controls/TrackballControls"

enum CameraState {
    Idle, MovingAndRotating, Moving
}

export default class CameraController extends Controller {
    public offset = new Vector3();

    private orbitControls: OrbitControls | null = null;
    private target = new Vector3();
    private startingPosition = new Vector3();
    private rotationMatrix = new Matrix4();
    private targetRotation = new Quaternion();
    private newRotation = new Quaternion();
    private startingRotation = new Quaternion();
    private rotation = new Euler()
    private isLocked = false

    private progress = 0;

    private state = CameraState.Idle;

    start() {
        this.orbitControls = new OrbitControls(Controller.mainCamera, Controller.renderer.domElement);
        this.orbitControls.enableRotate = false
        Controller.mainCamera.position.y = 5
    }

    update() {
        //console.log(Controller.mainCamera.quaternion)
        //this.orbitControls?.update();

        if(this.isLocked) {
            this.orbitControls?.update();
        }

        if (this.state === CameraState.MovingAndRotating) {
            
            this.moveAndRotateCamera();
        } else if (this.state === CameraState.Moving) {
            this.moveCamera();
        }
    }

    moveAndRotateCamera() {
        Controller.mainCamera.position.lerpVectors(this.startingPosition, this.target, this.progress);

        Quaternion.slerp(this.startingRotation, this.targetRotation, this.newRotation, this.progress);
        Controller.mainCamera.quaternion.set(this.newRotation.x, this.newRotation.y, this.newRotation.z, this.newRotation.w);

        this.progress += 1 * Time.deltaTime;

        if (this.progress >= 1) {
            this.progress = 0;

            this.state = CameraState.Idle;
            if (this.orbitControls) {
                this.isLocked = true;
                this.orbitControls.autoRotate = true;
            }
        }
    }

    setTarget(target: Vector3) {
        this.state = CameraState.MovingAndRotating;

        this.target = target.clone().add(this.offset);
        this.progress = 0;
        this.startingPosition = Controller.mainCamera.position.clone();

        this.rotationMatrix = new Matrix4();
        this.targetRotation = new Quaternion();
        this.newRotation = new Quaternion();
        this.startingRotation = Controller.mainCamera.quaternion.clone();

        this.rotationMatrix.lookAt(this.target, target, new Vector3(0, 1, 0));
        this.targetRotation.setFromRotationMatrix(this.rotationMatrix);

        this.orbitControls?.target.set(target.x, target.y, target.z);
    }

    moveCamera() {
        Controller.mainCamera.position.lerpVectors(this.startingPosition, this.target, this.progress);
        this.orbitControls?.target.set(Controller.mainCamera.position.x, Controller.mainCamera.position.y, Controller.mainCamera.position.z)
        Controller.mainCamera.setRotationFromEuler(this.rotation)

        this.progress += 1 * Time.deltaTime;
        if (this.progress >= 1) {
            this.progress = 0;

            Controller.mainCamera.position.z += 0.001

            this.state = CameraState.Idle;
        }
    }

    setPosition(target: Vector3) {
        this.state = CameraState.Moving;
        if (this.orbitControls) {
            this.orbitControls.autoRotate = false;
            this.isLocked = false
        }
        this.target = target.clone().add(new Vector3(0, 5, 2))
        this.progress = 0;
        this.startingPosition = Controller.mainCamera.position.clone();
        this.rotation = Controller.mainCamera.rotation.clone();
    }
}