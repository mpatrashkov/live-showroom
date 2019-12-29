import { Scene, PerspectiveCamera, WebGLRenderer, Raycaster, Vector2 } from "three";
import Controller from "./Controller";
import Time from "./utils/Time";
import Entity from "./Entity";

export default class GameManager {
    private scene: Scene;
    public mainCamera: PerspectiveCamera;
    private activeCamera: PerspectiveCamera;
    private renderer: WebGLRenderer;

    public entities: Entity[];

    constructor(mount: any) {
        this.entities = [];

        this.scene = new Scene();
        this.mainCamera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.activeCamera = this.mainCamera;

        this.renderer = new WebGLRenderer();

        this.renderer.setSize(mount.offsetWidth, mount.offsetHeight);

        window.onresize = () => {
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.activeCamera.aspect = this.getCameraAspectRatio();
            this.activeCamera.updateProjectionMatrix();
        }

        this.mainCamera.position.z = 5;

        mount.appendChild(this.renderer.domElement);

        Controller.scene = this.scene;
        Controller.renderer = this.renderer;
        Controller.manager = this;
        Controller.mainCamera = this.mainCamera;
    }

    destroy() {
        window.onresize = () => {};
        this.entities = [];
    }

    start() {
        let prevTime: number | null = null;

        this.handleClicks();

        const animate = (now: DOMHighResTimeStamp) => {
            if(!prevTime) {
                prevTime = now;
            }

            let deltaTime = (now - prevTime) / 1000;
            Time.deltaTime = deltaTime;

            prevTime = now;

            this.entities.forEach(entity => {
                entity.controllers.forEach(controller => {
                    controller.update();
                });
            });

            requestAnimationFrame(animate);
            this.renderer.render(this.scene, this.activeCamera);
        };

        requestAnimationFrame(animate);
    }

    handleClicks() {
        Controller.renderer.domElement.addEventListener("click", (event) => {
            const raycaster = new Raycaster();

            const mouse = new Vector2();
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse.clone(), Controller.mainCamera);
            const intersects = raycaster.intersectObjects(Controller.scene.children, true);

            for(let intersect of intersects) {
                const hitEntity = this.findEntityByName(intersect.object.name);
                hitEntity?.controllers.forEach(controller => controller.onClick())
                break;
            }
        }, true);
    }

    addEntity(name: string): Entity {
        const entity = new Entity(name);
        this.entities.push(entity);
        this.scene.add(entity.mesh);

        return entity;
    }

    removeEntity(entity: Entity) {
        this.scene.remove(entity.mesh);
        this.entities = this.entities.filter(item => item !== entity);
    }

    findEntityByName(name: string) : Entity | undefined {
        return this.entities.find(entity => entity.name === name);
    }

    changeActiveCamera(camera: PerspectiveCamera) {
        this.activeCamera = camera;
        this.activeCamera.aspect = this.getCameraAspectRatio();
    }

    private getCameraAspectRatio() {
        return window.innerWidth / window.innerHeight;
    }
}