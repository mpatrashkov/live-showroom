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
    boxMin = new Vector3()

    private dev = false

    tileCount = new Vector2()
    gridPosition

    private editableController: EditableController

    boxHelper: BoxHelper

    start() {
        this.editableController = this.entity.getController(EditableController)
        this.calculatePivot()

        this.gridPosition = this.gridPosition || this.grid.getFreeSpot(this.tileCount)
        
        if(this.gridPosition === null) {
            this.destroy()
            return
        }

        this.grid.setArea(this.gridPosition, this.tileCount, 100);
        this.transform.position = this.grid.gridToWorldPosition(this.gridPosition)
                                           .add(this.gridOffset)

        if(this.dev) {
            this.boxHelper = new BoxHelper(this.mesh.children[0].children[0] || this.mesh, new Color(0xff0000));
            Controller.scene.add(this.boxHelper)
            this.mesh.add(new Line(new BufferGeometry().setFromPoints([new Vector3(), new Vector3(0, 10, 0)]), new LineBasicMaterial( { color: 0x00ffff } )))
        }
    }
    
    update() {
        const hit = Raycast.fromCamera(Input.mousePosition, [this.ground]);
        if(hit) {
            let newGridPosition = this.grid.worldToGridPosition(hit.point)
            this.setPosition(newGridPosition)
        }
    }

    calculateBoxMin() {
        const pivot = this.mesh.children[0]
        const object = pivot.children[0]

        const size = new Vector3()
        const box = new Box3().setFromObject(object || this.mesh)
        box.getSize(size)
        
        this.boxMin = box.min.clone()

        return { size, box }
    }

    calculatePivot() {
        const pivot = this.mesh.children[0]
        const object = pivot.children[0]

        const { size, box } = this.calculateBoxMin();
        
        this.boxMin = box.min.clone()
        const center = box.min.clone().sub(box.max).divideScalar(2).add(box.max)

        center.setY(0)
        object.position.copy(center.multiplyScalar(-1))

        this.tileCount = new Vector2(
            Math.ceil(size.x / this.grid.tileSize),
            Math.ceil(size.z / this.grid.tileSize),
        )

        const gridSizeX = this.tileCount.x * this.grid.tileSize
        const gridSizeY = this.tileCount.y * this.grid.tileSize

        this.gridOffset = new Vector3(
            gridSizeX / 2 - this.grid.tileSize / 2,
            0,
            gridSizeY / 2 - this.grid.tileSize / 2
        );

        this.calculateBoxMin()
    }

    positionOnGrid() {
        const pivot = this.mesh.children[0]

        const position = this.grid.worldToGridPosition(pivot.position.sub(this.gridOffset))
        this.setPosition(position)
    }

    setPosition(newGridPosition) {
        newGridPosition = this.grid.getSafePosition(newGridPosition, this.tileCount)

        this.gridPosition = newGridPosition.clone();
        this.transform.position = this.grid.gridToWorldPosition(this.gridPosition)
                                            .add(this.gridOffset)
                                            
        if(this.grid.isAreaFree(newGridPosition, this.tileCount)) {
            this.editableController.highlightValid()
        }
        else {
            this.editableController.highlightInvalid()
        }
    }

    setSize(newSize) {
        this.tileCount.set(newSize.x, newSize.y);

        const gridSizeX = this.tileCount.x * this.grid.tileSize
        const gridSizeY = this.tileCount.y * this.grid.tileSize

        this.gridOffset = new Vector3(
            gridSizeX / 2 - this.grid.tileSize / 2,
            0,
            gridSizeY / 2 - this.grid.tileSize / 2
        );
    }

    getOffsetedPosition(postion: Vector3) {
        return postion.clone().add(this.gridOffset)
    }
}