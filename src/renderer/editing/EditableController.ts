import Controller from "../Controller";
import MovableController from "./MovableController";
import Entity from "../Entity";
import EventSystem, { EventType } from "../utils/EventSystem";

export default class EditableController extends Controller {
    ground: Entity
    grid: Entity
    gridSize = 2

    movableController: MovableController

    private editMode = "move"
    private editModeEnabled = false

    start() {
        this.movableController = this.entity.addController(MovableController)
        this.movableController.ground = this.ground
        this.movableController.gridSize = this.gridSize
        this.movableController.enabled = false

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
    }

    onClick() {
        this.editModeEnabled = !this.editModeEnabled
        this.grid.mesh.visible = !this.grid.mesh.visible

        if(this.editMode === "move") {
            this.movableController.enabled = !this.movableController.enabled;
        }
    }
}