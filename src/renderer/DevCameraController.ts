import Controller from "./Controller";
import Entity from "./Entity";
import { PerspectiveCamera, Vector3 } from "three";

export default class DevCameraController extends Controller {
    camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    offset = new Vector3(2, 2, 2);
    state: "on" | "off" = "off";

    setup() {
        this.transform.position.y += 5;
    }
    
    setTarget(entity: Entity) {
        this.transform.position = entity.transform.position.clone().add(this.offset);
        this.camera.position.set(this.transform.position.x, this.transform.position.y, this.transform.position.z);
        this.camera.lookAt(entity.transform.position);
    }

    toggle(state?: "on" | "off") {
        if(state === this.state) {
            return;
        }

        if(this.state === "on") {
            Controller.manager.changeActiveCamera(Controller.mainCamera);
            this.state = "off";
        }
        else {
            Controller.manager.changeActiveCamera(this.camera);
            this.state = "on";
        }
    }
}