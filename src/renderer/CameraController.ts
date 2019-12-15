import Controller from "./Controller";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Vector3, Matrix4, Quaternion } from "three";
import Time from "./utils/Time";

enum CameraState {
    Idle, Moving
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
    
    private progress = 0;

    private state = CameraState.Idle;

    start() {
        this.orbitControls = new OrbitControls(Controller.mainCamera, Controller.renderer.domElement);
    }

    update() {
        this.orbitControls?.update();

        if(this.state === CameraState.Moving) {
            this.moveCamera();
        }
    }

    moveCamera() {
        Controller.mainCamera.position.lerpVectors(this.startingPosition, this.target, this.progress);

        Quaternion.slerp(this.startingRotation, this.targetRotation, this.newRotation, this.progress);
        Controller.mainCamera.quaternion.set(this.newRotation.x, this.newRotation.y, this.newRotation.z, this.newRotation.w);

        this.progress += 1 * Time.deltaTime;

        if(this.progress >= 1) {
            this.progress = 0;

            this.state = CameraState.Idle;
            if(this.orbitControls) {
                this.orbitControls.autoRotate = true;
            }
        }
    }

    setTarget(target: Vector3) {
        this.state = CameraState.Moving;

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
}