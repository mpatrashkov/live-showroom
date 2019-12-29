import { Scene, Mesh, WebGLRenderer, PerspectiveCamera, Raycaster, Vector2, Vector3 } from "three";
import Entity from "./Entity";
import Transform from "./Transform";

abstract class Controller {
    public static scene: Scene;
    public static renderer: WebGLRenderer;
    public static mainCamera: PerspectiveCamera;

    public entity: Entity;
    public transform: Transform;
    public mesh: Mesh;

    constructor(entity: Entity) {
        this.entity = entity;
        this.transform = entity.transform;
        this.mesh = entity.mesh;
    }

    start() { }

    update() { }

    onClick(point?: Vector3) { }
}

export default Controller;