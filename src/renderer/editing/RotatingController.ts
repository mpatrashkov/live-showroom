import Controller from "../Controller";
import { DeltaDrag } from "../utils/Drag";
import { Euler, Vector3 } from "three";

export default class RotatingController extends Controller {
    rotateThreshold = 50
    prevPostion = 0

    onMouseMove(x, y) {
        if(x - this.prevPostion >= this.rotateThreshold) {
            console.log(1)
            let newRotation = this.transform.eulerRotation.toVector3()
            newRotation.add(new Vector3(0, -Math.PI / 2, 0))
            this.transform.eulerRotation = new Euler().setFromVector3(newRotation)
            this.prevPostion = x
        }

    }
}