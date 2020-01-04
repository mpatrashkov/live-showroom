import Controller from "../Controller";
import { Vector3, Camera } from "three";
import Time from "../utils/Time";

export default class CameraMovementController extends Controller {
    private moving = false;
    private targetPosition = new Vector3();
    private startingPosition = new Vector3();
    private progress = 0;

    public initialSpeed = 0.5;
    public acceleration = 1.2;
    public currentSpeed = 0;

    start() {
        this.currentSpeed = this.initialSpeed;
    }

    update() {
        if(this.moving) {
            Controller.mainCamera.position.lerpVectors(this.startingPosition, this.targetPosition, this.progress);
            this.progress += this.currentSpeed * Time.deltaTime;
            this.currentSpeed += this.acceleration * Time.deltaTime;
            if (this.progress >= 1) {
                this.progress = 0;
                this.currentSpeed = this.initialSpeed;
                this.moving = false;
                // Controller.mainCamera.position.z += 0.001
            }
        }
    }

    setPosition(point: Vector3) {
        this.startingPosition = Controller.mainCamera.position.clone();
        this.targetPosition = point;

        // Keep the y-axis the same so that the camera does not get into the floor
        this.targetPosition.y = this.startingPosition.y;

        this.moving = true;
    }
}