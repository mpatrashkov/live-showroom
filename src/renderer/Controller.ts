import { Scene, Mesh, WebGLRenderer, PerspectiveCamera, Raycaster, Vector2, Vector3 } from "three";
import Entity from "./Entity";
import Transform from "./Transform";
import GameManager from "./Renderer";

type UpdateCallback = (clear: Function) => void

type DeltaDrag = {
    x: number,
    y: number
}

abstract class Controller {
    public static scene: Scene;
    public static renderer: WebGLRenderer;
    public static mainCamera: PerspectiveCamera;
    public static manager: GameManager;
    
    public enabled: boolean;
    public entity: Entity;
    public transform: Transform;
    public mesh: Mesh;

    private updateListeners: UpdateCallback[] = [];

    constructor(entity: Entity) {
        this.enabled = true;
        this.entity = entity;
        this.transform = entity.transform;
        this.mesh = entity.mesh;
    }

    startUpdate() {
        this.updateListeners.forEach(listener => listener(() => {
            this.updateListeners.splice(
                this.updateListeners.indexOf(listener)
            );
        }));
        this.update();
    }

    start() { }

    update() { }

    destroy() { }

    onClick(point?: Vector3) { }

    onMouseDown(point?: Vector3) { }

    onMouseDrag(deltaDrag: DeltaDrag) { }

    onUpdate(callback: UpdateCallback) {
        this.updateListeners.push(callback);
    }
}

export default Controller;