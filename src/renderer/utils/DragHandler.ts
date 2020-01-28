import { Quaternion, Euler, PerspectiveCamera } from "three";
import Controller from "../Controller";
import GameManager from "../Renderer";

export default class DragHandler {
    public renderer: GameManager | null = null;
    private isDragging = false;
    private previousMousePosition = {
        x: 0,
        y: 0
    };

    setup(renderer: GameManager, camera: PerspectiveCamera) {

        this.renderer = renderer;
        this.renderer.getDOMElement().addEventListener('mousedown', () => {
            this.isDragging = true;
        });
        this.renderer.getDOMElement().addEventListener('mousemove', (e) => {
            var deltaMove = {
                x: e.offsetX - this.previousMousePosition.x,
                y: e.offsetY - this.previousMousePosition.y
            };

            if (this.isDragging) {

                var deltaRotationQuaternion = new Quaternion()
                    .setFromEuler(new Euler(
                        0,
                        this.toRadians(deltaMove.x * 1),
                        0,
                        'XYZ'
                    ));

                var qm = new Quaternion()

                const q = camera.quaternion.multiplyQuaternions(deltaRotationQuaternion, camera.quaternion);
                Quaternion.slerp(Controller.mainCamera.quaternion, q, qm, 1)
                Controller.mainCamera.quaternion.set(qm.x, qm.y,qm.z,qm.w)
            }

            this.previousMousePosition = {
                x: e.offsetX,
                y: e.offsetY
            };
        });
        /* */

        this.renderer.getDOMElement().addEventListener('mouseup', (e) => {
            this.isDragging = false;
        });
    }

    toRadians(angle: any) {
        return angle * (Math.PI / 180);
    }

    toDegrees(angle: any) {
        return angle * (180 / Math.PI);
    }
}