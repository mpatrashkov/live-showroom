import Controller from "../Controller"
import Entity from "../Entity"
import { Vector3, Matrix4, Spherical, MeshBasicMaterial } from "three";
import Time from "../utils/Time";
import MathHelpers from "../utils/MathHelpers";
import { DeltaDrag } from "../utils/Drag";

import Raycast from "../utils/Raycast";
import DesignCameraController from "./DesignCameraController";

export default class DesignCameraOrbitingController extends Controller {
    public targetPostion = new Vector3(0, 0, 0);
    public orbitSpeed = 15;
    public panSpeed = 0.5;

    public scrollSpeed = 0.5;
    public scrollRange: [number, number] = [5, 45];

    public angleRange: [number, number] = [5, 55];

    private cameraController: DesignCameraController | null = null;

    start() {
        this.cameraController = this.entity.getController(DesignCameraController);
        const pos = Controller.mainCamera.position;
        const sph = new Spherical();
        sph.setFromVector3(pos);

        this.rotateAround(0, 0, 0);
    }

    rotateAround(deltaTheta: number, deltaPhi: number, deltaR: number) {
        const pos = Controller.mainCamera.position;

        pos.sub(this.targetPostion)
        const sph = new Spherical();
        sph.setFromVector3(pos);

        sph.theta += deltaTheta;
        sph.phi += deltaPhi;
        sph.phi = MathHelpers.clamp(sph.phi, MathHelpers.toRad(90 - this.angleRange[1]), MathHelpers.toRad(90 - this.angleRange[0]));
        sph.radius += deltaR * this.scrollSpeed;
        sph.radius = MathHelpers.clamp(sph.radius, this.scrollRange[0], this.scrollRange[1])
        // console.log
        
        pos.setFromSpherical(sph);

        pos.add(this.targetPostion);
        let rotationMatrix = new Matrix4();
        rotationMatrix.lookAt(Controller.mainCamera.position, this.targetPostion, new Vector3(0, 1, 0));
        this.transform.rotation.setFromRotationMatrix(rotationMatrix);
        this.cameraController.currentPitchAngle = -(Math.PI / 2 - sph.phi);
    }

    onMouseDrag(deltaDrag: DeltaDrag) {
        const dragFactor = Math.PI / (100 / this.panSpeed);

        let deltaTheta = -deltaDrag.x * dragFactor;
        let deltaPhi = -deltaDrag.y * dragFactor;

        this.rotateAround(deltaTheta, deltaPhi, 0);
    }

    onMouseScroll(delta: number) {
        this.rotateAround(0, 0, 3 * delta);
    }
}