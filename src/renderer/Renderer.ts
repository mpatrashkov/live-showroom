import { Scene, PerspectiveCamera, WebGLRenderer, Raycaster, Object3D, Quaternion } from "three";
import Controller from "./Controller";
import Time from "./utils/Time";
import Entity from "./Entity";


import Drag from "./utils/Drag";
import Input from "./utils/Input";

export default class GameManager {
    public scene: Scene;
    public mainCamera: PerspectiveCamera;
    private activeCamera: PerspectiveCamera;
    private renderer: WebGLRenderer;

    // private dragHandler: DragHandler;

    public entities: Entity[];

    public q = new Quaternion()

    constructor(mount: any) {
        this.entities = [];

        this.scene = new Scene();
        this.mainCamera = new PerspectiveCamera(75, this.getCameraAspectRatio(), 0.1, 1000);
        this.activeCamera = this.mainCamera;

        this.renderer = new WebGLRenderer();
        this.renderer.shadowMap.enabled = true;
        // this.dragHandler = new DragHandler();

        this.renderer.setSize(mount.offsetWidth, mount.offsetHeight);

        window.onresize = () => {
            this.renderer.setSize(mount.offsetWidth, mount.offsetHeight);
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
        window.onresize = () => { };
        this.entities = [];
    }

    start() {
        let prevTime: number | null = null;

        this.handleClicks();
        Input.setup(this);
        Drag.setup(this);
        Drag.onDrag((deltaDrag) => {
            this.entities.forEach(entity => {
                entity.controllers.forEach(controller => {
                    if(controller.enabled) {
                        controller.onMouseDrag(deltaDrag)
                    }
                })
            })
        })

        const animate = (now: DOMHighResTimeStamp) => {
            if (!prevTime) {
                prevTime = now;
            }

            let deltaTime = (now - prevTime) / 1000;
            Time.deltaTime = deltaTime;

            prevTime = now;

            this.entities.forEach(entity => {
                entity.controllers.forEach(controller => {
                    if(controller.enabled) {
                        controller.startUpdate();
                    }
                });
            });

            requestAnimationFrame(animate);
            this.renderer.render(this.scene, this.activeCamera);
        };

        requestAnimationFrame(animate);
    }

    handleClicks() {
        Controller.renderer.domElement.addEventListener("click", (event) => {
            this.handleMouseAction(controller => controller.onClick);
        }, true);

        Controller.renderer.domElement.addEventListener("mousedown", (event) => {
            this.handleMouseAction(controller => controller.onMouseDown);
        }, true);

        Controller.renderer.domElement.addEventListener("mouseup", (event) => {
            this.handleMouseAction(controller => controller.onMouseUp);
        }, true);
    }

    handleMouseAction(callbackFunction: (controller: Controller) => Function) {
        const raycaster = new Raycaster();

        const mouse = Input.mousePosition;

        raycaster.setFromCamera(mouse.clone(), Controller.mainCamera);
        const intersects = raycaster.intersectObjects(Controller.scene.children, true);
        for(let intersect of intersects) {   
            const clickEvent = (object: Object3D) => {
                const hitEntity = this.findEntityByName(object.name);
                hitEntity?.controllers.forEach(controller => callbackFunction(controller).call(controller, intersect.point))
                if(object.parent) {
                    clickEvent(object.parent);
                }
            }

            clickEvent(intersect.object);
        }
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

    findEntityByName(name: string): Entity | undefined {
        return this.entities.find(entity => entity.name === name);
    }

    changeActiveCamera(camera: PerspectiveCamera) {
        this.activeCamera = camera;
        this.activeCamera.aspect = this.getCameraAspectRatio();
    }

    private getCameraAspectRatio() {
        return window.innerWidth / window.innerHeight;
    }

    getDOMElement() {
        return this.renderer.domElement;
    }
}