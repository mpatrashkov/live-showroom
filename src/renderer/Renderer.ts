import { Scene, PerspectiveCamera, WebGLRenderer, Raycaster, Object3D, Quaternion, Vector2 } from "three";
import Controller from "./Controller";
import Time from "./utils/Time";
import Entity from "./Entity";

import { CopyShader } from "three/examples/jsm/shaders/CopyShader";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass";

import Drag from "./utils/Drag";
import Input from "./utils/Input";
import Outline from "./utils/Outline";

export default class GameManager {
    public scene: Scene;
    public mainCamera: PerspectiveCamera;
    private activeCamera: PerspectiveCamera;
    private renderer: WebGLRenderer;
    public outlinePass: OutlinePass;

    public entities: Entity[];

    private nextFrameListeners = [];

    constructor(mount: any) {
        this.entities = [];

        this.scene = new Scene();
        this.mainCamera = new PerspectiveCamera(75, this.getCameraAspectRatio(), 0.1, 1000);
        this.activeCamera = this.mainCamera;

        this.renderer = new WebGLRenderer();
        this.renderer.shadowMap.enabled = true;

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
        this.getDOMElement().addEventListener('wheel', (event: WheelEvent) => {
            this.entities.forEach(entity => {
                entity.controllers.forEach(controller => {
                    if(controller.enabled) {
                        controller.onMouseScroll(Math.sign(event.deltaY))
                    }
                })
            })
        });
        this.getDOMElement().addEventListener('mousemove', (event) => {
            this.entities.forEach(entity => {
                entity.controllers.forEach(controller => {
                    if(controller.enabled) {
                        controller.onMouseMove(event.offsetX, event.offsetY)
                    }
                })
            })
        });

        const composer = new EffectComposer(this.renderer)
        const renderPass = new RenderPass(this.scene, this.activeCamera);
        composer.addPass(renderPass);
        renderPass.renderToScreen = true;

        this.outlinePass = new OutlinePass(new Vector2(window.innerWidth, window.innerHeight), this.scene, this.activeCamera);
        composer.addPass(this.outlinePass);

        const animate = (now: DOMHighResTimeStamp) => {
            renderPass.camera = this.activeCamera;
            if (!prevTime) {
                prevTime = now;
            }

            let deltaTime = (now - prevTime) / 1000;
            Time.deltaTime = deltaTime;

            prevTime = now;
            
            this.outlinePass.selectedObjects = Outline.getSelectedObjects();

            this.callNextFrameListeners()

            this.entities.forEach(entity => {
                entity.controllers.forEach(controller => {
                    if(controller.enabled) {
                        controller.startUpdate();
                    }
                });
            });

            requestAnimationFrame(animate);
            composer.render();
        };

        requestAnimationFrame(animate);
    }

    handleClicks() {
        Controller.renderer.domElement.addEventListener("click", (event) => {
            this.handleMouseAction(controller => controller.onClick);
        }, true);

        Controller.renderer.domElement.addEventListener("click", (event) => {
            this.handleMouseAction(controller => controller.onClickOnce, true);
        }, true);

        Controller.renderer.domElement.addEventListener("mousedown", (event) => {
            this.handleMouseAction(controller => controller.onMouseDown);
        }, true);

        Controller.renderer.domElement.addEventListener("mousedown", (event) => {
            this.handleMouseAction(controller => controller.onMouseDownOnce, true);
        }, true);

        Controller.renderer.domElement.addEventListener("mouseup", (event) => {
            this.handleMouseAction(controller => controller.onMouseUp);
        }, true);

        Controller.renderer.domElement.addEventListener("mouseup", (event) => {
            this.handleMouseAction(controller => controller.onMouseUpOnce, true);
        }, true);
    }

    handleMouseAction(callbackFunction: (controller: Controller) => Function, once?: boolean) {
        const raycaster = new Raycaster();

        const mouse = Input.mousePosition;

        raycaster.setFromCamera(mouse.clone(), Controller.mainCamera);
        const intersects = raycaster.intersectObjects(Controller.scene.children, true);
        for(let intersect of intersects) {   
            const clickEvent = (object: Object3D) => {
                const hitEntity = this.findEntityByName(object.name);
                hitEntity?.controllers.forEach(controller => callbackFunction(controller).call(controller, intersect.point))
                if(hitEntity && once) {
                    return true
                }
                if(object.parent) {
                    return clickEvent(object.parent);
                }
            }

            if(clickEvent(intersect.object)) {
                break;
            }
        }
    }

    addEntity(name: string): Entity {
        let i = 0
        let currName = name

        // eslint-disable-next-line no-loop-func
        while(this.entities.find(entity => entity.name === currName)) {
            i++
            currName = `${name}(${i})`;
        }

        const entity = new Entity(currName);
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

    nextFrame(callback) {
        this.nextFrameListeners.push(callback)
    }

    callNextFrameListeners() {
        for(let listener of this.nextFrameListeners) {
            listener()
        }

        this.nextFrameListeners = []
    }
}