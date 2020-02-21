import Controller from "../Controller";
import MovableController from "./MovableController";
import Entity from "../Entity";
import EventSystem, { EventType } from "../utils/EventSystem";
import GridController from "../grid/GridController";
import Grid from "../grid/Grid";
import { Mesh, Euler, MeshBasicMaterial, DoubleSide, PlaneBufferGeometry, Vector3, Box3 } from "three";
import Drag from "../utils/Drag";
import RotatingController from "./RotatingController";

export default class EditableController extends Controller {
    ground: Entity
    gridEntity: Entity
    grid: Grid
    gridController: GridController

    movableController: MovableController
    rotatingController: RotatingController

    private editMode = "move"
    private editModeEnabled = false

    private squareMaterial = new MeshBasicMaterial({ color: 0x00ff00, side: DoubleSide });
    private squareGeometry

    private highlightPlane: Mesh

    private static currentController: EditableController = null

    start() {
        this.gridController = this.gridEntity.getController(GridController)
        this.grid = this.gridController.grid
        this.squareGeometry = new PlaneBufferGeometry(this.grid.tileSize, this.grid.tileSize, 1)

        this.movableController = this.entity.addController(MovableController)
        this.movableController.ground = this.ground
        this.movableController.grid = this.grid
        this.movableController.enabled = false

        this.rotatingController = this.entity.addController(RotatingController)
        this.rotatingController.ground = this.ground
        this.rotatingController.grid = this.grid
        this.rotatingController.enabled = false

        EventSystem.on(EventType.EditModeChange, (mode) => {
            this.editMode = mode
            
            if(this.editModeEnabled) {
                if(this.editMode === "move") {
                    if(this.grid.isAreaFree(this.movableController.gridPosition, this.movableController.tileCount)) {
                        this.disableEdit();
                        this.enableEdit();
                        this.movableController.enabled = true;
                        this.rotatingController.enabled = false;
                    }
                }
                else if(this.editMode === "rotate") {
                    this.disableEdit();
                    this.enableEdit();
                    this.movableController.enabled = false;
                    this.rotatingController.enabled = true;
                }
            }
        })

        EventSystem.on(EventType.GroundClicked, () => {
            if(this.editModeEnabled) {
                Controller.manager.nextFrame(() => {
                    this.toggleEdit(false)
                })
            }
        })
    }

    onMouseDownOnce() {
        Drag.startDragCheck();
    }

    onMouseUpOnce() {
        if(!Drag.checkDrag()) {
            this.toggleEdit()
        }
    }

    toggleEdit(state?: boolean) {
        if(state === this.editModeEnabled) {
            return
        }

        if(state === undefined) {
            state = !this.editModeEnabled
        }

        if(EditableController.currentController === null) {
            EditableController.currentController = this
        }

        if(EditableController.currentController !== this) {
            return
        }

        if(state === false && !this.grid.isAreaFree(this.movableController.gridPosition, this.movableController.tileCount)) {
            this.editModeEnabled = true
            return
        }

        this.editModeEnabled = state
        this.gridEntity.mesh.visible = state

        if(state === false) {
            this.disableEdit();
        }
        else {
            this.enableEdit();
        }

        if(this.editMode === "move") {
            this.movableController.enabled = state   
        }
        else if(this.editMode === "rotate") {
            this.rotatingController.enabled = state
        }
    }

    enableEdit() {
        this.grid.setArea(this.movableController.gridPosition, this.movableController.tileCount, 0)
        this.gridController.toggleSquares(true)
        this.showHighlightPlane()
    }

    disableEdit() {
        this.grid.setArea(this.movableController.gridPosition, this.movableController.tileCount, 100)
        this.gridController.toggleSquares(false)
        this.hideHighlightPlane()
        EditableController.currentController = null
    }

    showHighlightPlane() {
        this.addSquare()
    }

    hideHighlightPlane() {
        this.mesh.remove(this.highlightPlane)
    }

    updateHighlightPlane() {
        this.hideHighlightPlane()
        this.showHighlightPlane()
    }

    addSquare() {
        const w = this.movableController.tileCount.x
        const h = this.movableController.tileCount.y

        this.highlightPlane = new Mesh(this.squareGeometry, this.squareMaterial)
        this.highlightPlane.position.setY(0.035)
        this.highlightPlane.rotation.copy(new Euler(-Math.PI / 2, 0, 0))

        this.highlightPlane.scale.set(w, h, 1)

        this.mesh.add(this.highlightPlane)
    }

    public highlightInvalid() {
        if(this.highlightPlane.material instanceof MeshBasicMaterial) {
            this.highlightPlane.material.color.setHex(0xff0000)
        }
    }

    public highlightValid() {
        if(this.highlightPlane.material instanceof MeshBasicMaterial) {
            this.highlightPlane.material.color.setHex(0x00ff00)
        }
    }
}