import { Scene, PerspectiveCamera, WebGLRenderer, Camera, BoxGeometry, MeshBasicMaterial, Mesh, Raycaster, Vector2 } from "three";
import Controller from "./Controller";
import Time from "./utils/Time";
import Entity from "./Entity";

export default class Renderer {
    private scene: Scene;
    private mainCamera: PerspectiveCamera;
    private renderer: WebGLRenderer;

    private entities: Entity[];

    constructor(mount: any) {
        this.entities = [];

        this.scene = new Scene();
        this.mainCamera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new WebGLRenderer();

        this.renderer.setSize(window.innerWidth, window.innerHeight);

        window.onresize = () => {
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.mainCamera.aspect = window.innerWidth / window.innerHeight;
        }

        this.mainCamera.position.z = 5;

        mount.appendChild(this.renderer.domElement);

        Controller.scene = this.scene;
        Controller.renderer = this.renderer;
        Controller.mainCamera = this.mainCamera;
    }

    destroy() {
        window.onresize = () => {};
        this.entities = [];
    }

    start() {
        let prevTime: number | null = null;

        this.clickEvents();

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
            this.renderer.render(this.scene, this.mainCamera);
        };

        requestAnimationFrame(animate);
    }

    clickEvents() {
        Controller.renderer.domElement.addEventListener("click", (event) => {
            const raycaster = new Raycaster();

            const mouse = new Vector2();
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse.clone(), Controller.mainCamera);
            const intersects = raycaster.intersectObjects(Controller.scene.children, true);

            for(let intersect of intersects) {
                const hitEntity = this.findEntityByName(intersect.object.name)
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

    findEntityByName(name: string) : Entity | undefined {
        return this.entities.find(entity => entity.name === name);
    }
}