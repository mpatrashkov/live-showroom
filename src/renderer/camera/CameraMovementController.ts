import Controller from "../Controller";
import { Vector3 } from "three";
import Time from "../utils/Time";

export default class CameraMovementController extends Controller {
    private moving = false;
    private targetPosition = new Vector3();
    private startingPosition = new Vector3();
    private progress = 0;

    public initialSpeed = 0.5;
    public acceleration = 1.2;
    public deceleration = 5;
    public decelerationStart = 0.8;
    public currentSpeed = 0;

    start() {
        this.currentSpeed = this.initialSpeed;
    }

    update() {
        if(this.moving) {
            Controller.mainCamera.position.lerpVectors(this.startingPosition, this.targetPosition, this.progress);
            this.progress += this.currentSpeed * Time.deltaTime;
            
            if(this.progress > this.decelerationStart) {
                this.currentSpeed -= this.deceleration * Time.deltaTime;
            }
            else {
                this.currentSpeed += this.acceleration * Time.deltaTime;
            }
            if (this.progress >= 1) {
                this.progress = 0;
                this.currentSpeed = this.initialSpeed;
                this.moving = false;
            }
        }
    }

    setPosition(point: Vector3) {
        this.startingPosition = Controller.mainCamera.position.clone();
        this.targetPosition = point;

        this.moving = true;
    }
}