import { Scene, Mesh, WebGLRenderer, PerspectiveCamera, Raycaster, Vector2 } from "three";
import Entity from "./Entity";
import Transform from "./Transform";
import GameManager from "./Renderer";

abstract class Controller {
    public static scene: Scene;
    public static renderer: WebGLRenderer;
    public static mainCamera: PerspectiveCamera;
    public static manager: GameManager;

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

    destroy() { }

    onClick() { }
}

export default Controller;