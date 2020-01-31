import Controller from "../Controller"
import Entity from "../Entity"
import { Vector3, Matrix4, Quaternion, Camera, Spherical } from "three";
import Time from "../utils/Time";
import MathHelpers from "../utils/MathHelpers";
import Drag, { DeltaDrag } from "../utils/Drag";
import CameraController from "./CameraController";

export default class CameraOrbitController extends Controller {
    public target: Entity | null = null;
    public orbitSpeed = 15;
    public panSpeed = 0.5;

    private autoRotate = true;

    public angleRange: [number, number] = [0, 55];
    public startAutoRotateDuration = 3000;
    private startAutoRotateTimeout: NodeJS.Timeout | null = null;

    private cameraController: CameraController | null = null;

    start() {
        this.cameraController = this.entity.getController(CameraController);
        const pos = Controller.mainCamera.position;
        const sph = new Spherical();
        sph.setFromVector3(pos);
    }

    update() {
        if(this.target && this.autoRotate) {
            const deltaTheta = Math.PI * (1 / this.orbitSpeed) * Time.deltaTime;
            this.rotateAround(deltaTheta, 0);
        }
    }

    rotateAround(deltaTheta: number, deltaPhi: number) {
        if(this.target) {
            const pos = Controller.mainCamera.position;

            pos.sub(this.target.transform.position)
            const sph = new Spherical();
            sph.setFromVector3(pos);

            sph.theta += deltaTheta;
            sph.phi += deltaPhi;
            sph.phi = MathHelpers.clamp(sph.phi, MathHelpers.toRad(90 - this.angleRange[1]), MathHelpers.toRad(90 - this.angleRange[0]));
            
            pos.setFromSpherical(sph);

            pos.add(this.target.transform.position);
            let rotationMatrix = new Matrix4();
            rotationMatrix.lookAt(Controller.mainCamera.position, this.target.transform.position, new Vector3(0, 1, 0));
            this.transform.rotation.setFromRotationMatrix(rotationMatrix);
            this.cameraController.currentPitchAngle = -(Math.PI / 2 - sph.phi);
            // console.log(MathHelpers.toDeg(sph.phi), MathHelpers.toDeg(this.cameraController.currentPitchAngle));
        }
    }

    onMouseDrag(deltaDrag: DeltaDrag) {
        this.autoRotate = false;

        const dragFactor = Math.PI / (100 / this.panSpeed);

        let deltaTheta = -deltaDrag.x * dragFactor;
        let deltaPhi = -deltaDrag.y * dragFactor;

        this.rotateAround(deltaTheta, deltaPhi);
        if(this.startAutoRotateTimeout) {
            clearTimeout(this.startAutoRotateTimeout);
        }

        this.startAutoRotateTimeout = setTimeout(() => {
            this.autoRotate = true;
        }, this.startAutoRotateDuration);
    }
}