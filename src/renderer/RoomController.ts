import Controller from "./Controller";
import Grid from "./grid/Grid";
import WallController from "./WallController";
import Entity from "./Entity";
import GridController from "./grid/GridController";
import { Euler } from "three";

export default class RoomController extends Controller {
    gridEntity: Entity
    grid: Grid
    height: number = 10

    start() {
        this.grid = this.gridEntity.getController(GridController).grid

        const north = Controller.manager.addEntity("north-wall");
        let wallController = north.addController(WallController);
        wallController.width = this.grid.worldSize.x
        wallController.height = this.height
        north.transform.position.setZ(-this.grid.worldSize.y / 2)

        const south = Controller.manager.addEntity("south-wall");
        wallController = south.addController(WallController);
        wallController.width = this.grid.worldSize.x
        wallController.height = this.height
        south.transform.eulerRotation = new Euler(0, Math.PI, 0)
        south.transform.position.setZ(this.grid.worldSize.y / 2)

        const west = Controller.manager.addEntity("west-wall");
        wallController = west.addController(WallController);
        wallController.width = this.grid.worldSize.y
        wallController.height = this.height
        west.transform.eulerRotation = new Euler(0, Math.PI / 2, 0)
        west.transform.position.setX(-this.grid.worldSize.x / 2)

        const east = Controller.manager.addEntity("east-wall");
        wallController = east.addController(WallController);
        wallController.width = this.grid.worldSize.y
        wallController.height = this.height
        east.transform.eulerRotation = new Euler(0, -Math.PI / 2, 0)
        east.transform.position.setX(this.grid.worldSize.y / 2)

        // const wall3 = Controller.manager.addEntity("wall3");
        // wall3.addController(WallController);

        // const wall4 = Controller.manager.addEntity("wall4");
        // wall4.addController(WallController);
    }
}