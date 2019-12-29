import Controller from "./Controller";
import Transform from "./Transform";
import { Mesh } from "three";

export default class Entity {
    public controllers: Controller[] = [];
    public transform: Transform;
    public mesh: Mesh = new Mesh();

    constructor(public name: string) { 
        this.transform = this.addController(Transform);
        this.mesh.name = name;
    }

    addController<T extends Controller>(type: new (entity: Entity) => T): T {
        const controller = new type(this);
        controller.start();
        this.controllers.push(controller);

        return controller;
    }

    getController<T extends Controller>(type: new() => T): T | null {
        for(let controller of this.controllers) {
            if(controller instanceof type) {
                return controller;
            }
        }
        
        return null;
    }

    destroy() {
        this.controllers.forEach(controller => controller.destroy());
        Controller.manager.removeEntity(this);
    }
}