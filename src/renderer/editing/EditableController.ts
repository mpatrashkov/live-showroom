import Controller from "../Controller";
import MovableController from "./MovableController";
import Entity from "../Entity";
import EventSystem, { EventType } from "../utils/EventSystem";
import GridController from "../grid/GridController";
import Grid from "../grid/Grid";
import { Object3D, Mesh, Vector2, Euler, MeshBasicMaterial, DoubleSide, PlaneBufferGeometry, Vector3, Line, BufferGeometry, LineBasicMaterial } from "three";
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
        this.rotatingController.enabled = false

        EventSystem.on(EventType.EditModeChange, (mode) => {
            this.editMode = mode
            
            if(this.editModeEnabled) {
                if(this.editMode === "move") {
                    this.movableController.enabled = true;
                }
                else if(this.editMode === "rotate") {
                    this.movableController.enabled = false;
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
            // Controller.manager.nextFrame(() => {
                this.toggleEdit()
            // })
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

        if(state === false) {
            this.grid.setArea(this.movableController.gridPosition, this.movableController.tileCount, 100)
            this.gridController.toggleSquares(false)
            this.mesh.remove(this.highlightPlane)
            EditableController.currentController = null
        }
        else {
            this.grid.setArea(this.movableController.gridPosition, this.movableController.tileCount, 0)
            this.gridController.toggleSquares(true)
            this.addSquare()
        }

        this.editModeEnabled = state
        this.gridEntity.mesh.visible = state

        if(this.editMode === "move") {
            this.movableController.enabled = state
        }
        else if(this.editMode === "rotate") {
            this.rotatingController.enabled = state
        }
    }

    addSquare() {
        const w = this.movableController.tileCount.x
        const h = this.movableController.tileCount.y
        const tileSize = this.grid.tileSize

        this.highlightPlane = new Mesh(this.squareGeometry, this.squareMaterial)
        this.highlightPlane.position.copy(this.movableController.boxMin).add(new Vector3(w * tileSize / 2, 0, h * tileSize / 2))
        this.highlightPlane.position.setY(-this.transform.position.y + 0.035)
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