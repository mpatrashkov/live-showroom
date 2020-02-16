import Controller from "../Controller";
import Entity from "../Entity";
import Raycast from "../utils/Raycast";
import Input from "../utils/Input";
import { Box3, Vector3, BoxHelper, Color, Line, BufferGeometry, LineBasicMaterial, Vector2 } from "three";
import Grid from "../grid/Grid";
import EditableController from "./EditableController";

export default class MovableController extends Controller {
    ground: Entity;
    grid: Grid

    gridOffset = new Vector3()
    pivotOffset = new Vector3()
    boxMin = new Vector3()

    private dev = false

    tileCount = new Vector2()
    gridPosition = new Vector2()

    private editableController: EditableController

    start() {
        this.editableController = this.entity.getController(EditableController)
        const size = new Vector3()
        const box = new Box3().setFromObject(this.mesh.children[0] || this.mesh)
        box.getSize(size)

        this.boxMin = box.min.clone()
        const center = box.min.clone().sub(box.max).divideScalar(2).add(box.max)
        this.pivotOffset = this.transform.position.clone().sub(center)

        this.gridOffset = new Vector3((size.x - this.grid.tileSize) / 2, size.y / 2, (size.z - this.grid.tileSize) / 2)

        this.tileCount = new Vector2(
            Math.ceil(size.x / this.grid.tileSize),
            Math.ceil(size.z / this.grid.tileSize),
        )
        
        this.gridPosition = this.grid.getFreeSpot(this.tileCount)
        if(this.gridPosition === null) {
            this.destroy()
            return
        }

        console.log(this.gridPosition)
        console.log(this.tileCount)

        this.grid.setArea(this.gridPosition, this.tileCount, 100);
        this.transform.position = this.grid.gridToWorldPosition(this.gridPosition)
                                           .add(this.gridOffset)
                                           .add(this.pivotOffset)

        if(this.dev) {
            const boxHelper = new BoxHelper(this.mesh.children[0] || this.mesh, new Color(0xff0000));
            this.mesh.add(boxHelper)

            this.mesh.add(new Line(new BufferGeometry().setFromPoints([box.min, box.min.clone().add(new Vector3(0, 10, 0))]), new LineBasicMaterial( { color: 0xff00ff } )))
            this.mesh.add(new Line(new BufferGeometry().setFromPoints([box.max, box.max.clone().add(new Vector3(0, 10, 0))]), new LineBasicMaterial( { color: 0x0000ff } )))
            this.mesh.add(new Line(new BufferGeometry().setFromPoints([center, center.clone().add(new Vector3(0, 10, 0))]), new LineBasicMaterial( { color: 0x0000ff } )))
            this.mesh.add(new Line(new BufferGeometry().setFromPoints([new Vector3(), new Vector3(0, 10, 0)]), new LineBasicMaterial( { color: 0x00ffff } )))
        }
    }
    
    update() {
        const hit = Raycast.fromCamera(Input.mousePosition, [this.ground]);
        if(hit) {
            let newGridPosition = this.grid.worldToGridPosition(hit.point)
            if(!this.gridPosition.equals(newGridPosition)) {
                newGridPosition = this.grid.getSafePosition(newGridPosition, this.tileCount)
                // this.grid.moveObject(this.gridPosition, newGridPosition, this.tileCount)

                this.gridPosition = newGridPosition.clone();
                this.transform.position = this.grid.gridToWorldPosition(this.gridPosition).add(this.gridOffset).add(this.pivotOffset)

                if(this.grid.isAreaFree(newGridPosition, this.tileCount)) {
                    this.editableController.highlightValid()
                }
                else {
                    this.editableController.highlightInvalid()
                }
            }
        }
    }

    getOffsetedPosition(postion: Vector3) {
        return postion.clone().add(this.gridOffset).add(this.pivotOffset)
    }
}