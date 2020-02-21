import Controller from "../Controller";
import { Vector3 } from "three";
import MovableController from "./MovableController";
import EditableController from "./EditableController";

export default class RotatingController extends Controller {
    rotateThreshold = 50
    prevPostion = 0
    
    movableController: MovableController
    editableController: EditableController

    ground
    grid
    gridOffset

    start() {
        this.movableController = this.entity.getController(MovableController)
        this.editableController = this.entity.getController(EditableController)
        this.gridOffset = this.movableController.gridOffset
    }

    rotate() {
        const pivot = this.mesh.children[0]

        let newRotation = pivot.rotation.toVector3()
        newRotation.add(new Vector3(0, -Math.PI / 2, 0))
        pivot.rotation.setFromVector3(newRotation)

        const { size, pos } = this.movableController.grid.rotateArea(this.movableController.gridPosition, this.movableController.tileCount)
        this.movableController.setSize(size)
        this.movableController.setPosition(pos)
        this.editableController.updateHighlightPlane();
    }

    onMouseScroll() {
        this.rotate()
    }
}