import Controller from "./Controller";
import Transform from "./Transform";
import { Mesh } from "three";

export default class Entity {
    public controllers: Controller[] = [];
    public transform: Transform;
    public mesh: Mesh = new Mesh();
    public children: Entity[] = [];
    public parent: Entity | null = null;

    constructor(public name: string) { 
        this.transform = this.addController(Transform);
        this.mesh.name = name;
    }

    addController<T extends Controller>(type: new (entity: Entity) => T): T {
        const controller = new type(this);
        this.controllers.push(controller);
        controller.start();

        return controller;
    }

    getController<T extends Controller>(type: new (entity: Entity) => T): T | null {
        for(let controller of this.controllers) {
            if(controller instanceof type) {
                return controller;
            }
        }
        
        return null;
    }

    getControllerInChildren<T extends Controller>(type: new (entity: Entity) => T): T | null {
        this.children.forEach(child => {
            child.controllers.forEach(controller => {
                if(controller instanceof type) {
                    return controller;
                }
            })
        })
        
        return null;
    }

    destroy() {
        this.controllers.forEach(controller => controller.destroy());
        Controller.manager.removeEntity(this);
    }

    createChild(name: string): Entity {
        const entity = Controller.manager.addEntity(name);
        this.children.push(entity);
        entity.parent = this;

        return entity;
    }
}