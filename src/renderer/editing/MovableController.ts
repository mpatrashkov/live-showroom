import Controller from "../Controller";
import Entity from "../Entity";
import Raycast from "../utils/Raycast";
import Input from "../utils/Input";
import MathHelpers from "../utils/MathHelpers";
import { Box3, Vector3 } from "three";

export default class MovableController extends Controller {
    ground: Entity;
    gridSize: number
    
    update() {
        const hit = Raycast.fromCamera(Input.mousePosition, [this.ground]);
        if(hit) {
            const size = new Vector3()
            new Box3().setFromObject(this.mesh).getSize(size)
            
            const offset = new Vector3((size.x - this.gridSize) / 2, size.y / 2, (size.z - this.gridSize) / 2)

            this.transform.position = MathHelpers.roundVector(hit.point.divideScalar(this.gridSize))
                                                 .multiplyScalar(this.gridSize)
                                                 .add(offset)
        }
    }
}