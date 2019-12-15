import Controller from "./Controller";
import { Vector3, Quaternion, Euler } from "three";

export default class Transform extends Controller {
    public position: Vector3 = new Vector3(0, 0, 0);
    public rotation: Quaternion = new Quaternion(0, 0, 0, 1);

    // get eulerRotation(): Euler {
    //     return new Euler().setFromQuaternion(this.rotation);
    // }

    // set eulerRotation(value: Euler) {
    //     this.rotation.setFromEuler(value);
    // }

    update() {
        this.mesh.position.set(this.position.x, this.position.y, this.position.z);
        this.mesh.rotation.setFromQuaternion(this.rotation);
    }
}