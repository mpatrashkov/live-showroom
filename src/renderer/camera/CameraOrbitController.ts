import Controller from "../Controller"
import Entity from "../Entity"
import { Vector3, Matrix4, Quaternion, Camera, Spherical } from "three";
import Time from "../utils/Time";
import MathHelpers from "../utils/MathHelpers";
import Drag, { DeltaDrag } from "../utils/Drag";

export default class CameraOrbitController extends Controller {
    public target: Entity | null = null;
    public orbitSpeed = 15;
    public panSpeed = 0.5;

    private autoRotate = true;

    public angleRange: [number, number] = [-10, 55];
    public startAutoRotateDuration = 3000;
    private startAutoRotateTimeout: NodeJS.Timeout | null = null;


    start() {
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
            sph.phi = MathHelpers.between(sph.phi, MathHelpers.toRad(90 - this.angleRange[1]), MathHelpers.toRad(90 - this.angleRange[0]));
            
            pos.setFromSpherical(sph);

            pos.add(this.target.transform.position);
            Controller.mainCamera.lookAt(this.target.transform.position);
        }
    }

    onMouseDrag(deltaDrag: DeltaDrag) {
        this.autoRotate = false;

        const dragFactor = Math.PI / (100 / this.panSpeed);

        const deltaTheta = -deltaDrag.x * dragFactor;
        const deltaPhi = -deltaDrag.y * dragFactor;

        this.rotateAround(deltaTheta, deltaPhi);
        if(this.startAutoRotateTimeout) {
            clearTimeout(this.startAutoRotateTimeout);
        }

        this.startAutoRotateTimeout = setTimeout(() => {
            this.autoRotate = true;
        }, this.startAutoRotateDuration);
    }
}