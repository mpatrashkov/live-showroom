import Controller from "../Controller";
import { Vector3 } from "three";
import MovableController from "./MovableController";
import EditableController from "./EditableController";
import { DeltaDrag } from "../utils/Drag";

export default class RotatingController extends Controller {
    rotateThreshold = 50
    prevPostion = 0
    
    movableController: MovableController
    editableController: EditableController

    ground
    grid
    gridOffset

    threshold = 50
    currentDrag = 0

    start() {
        this.movableController = this.entity.getController(MovableController)
        this.editableController = this.entity.getController(EditableController)
        this.gridOffset = this.movableController.gridOffset
    }

    rotate(dir) {
        const pivot = this.mesh.children[0]

        let newRotation = pivot.rotation.toVector3()
        newRotation.add(new Vector3(0, -dir * Math.PI / 2, 0))
        pivot.rotation.setFromVector3(newRotation)

        const { size, pos } = this.movableController.grid.rotateArea(this.movableController.gridPosition, this.movableController.tileCount)
        this.movableController.setSize(size)
        this.movableController.setPosition(pos)
        this.editableController.updateHighlightPlane();
    }

    // onMouseScroll() {
    //     this.rotate()
    // }

    onMouseDrag(delta: DeltaDrag) {
        this.currentDrag += delta.x

        if(this.currentDrag >= this.threshold) {
            this.rotate(1)
            this.currentDrag = 0;
        }
        else if(this.currentDrag <= -this.threshold) {
            this.rotate(-1)
            this.currentDrag = 0;
        }
    }
}