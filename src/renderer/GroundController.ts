import Controller from "./Controller";
import { TextureLoader, Vector2, RepeatWrapping, PlaneGeometry, MeshBasicMaterial, Euler, PlaneBufferGeometry, MeshLambertMaterial, Mesh } from "three";
import EventSystem, { EventType } from "./utils/EventSystem";
import Drag from "./utils/Drag";

export default class GroundController extends Controller {
    start() {
        const textureDensity = 3;

        // const texture = new TextureLoader().load("data:image/jpeg;base64,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");
        // texture.repeat = new Vector2(this.mesh.scale.x * textureDensity, this.mesh.scale.y * textureDensity);
        // texture.wrapS = RepeatWrapping;
        // texture.wrapT = RepeatWrapping;

        var groundGeo = new PlaneBufferGeometry(30, 30);
        var groundMat = new MeshLambertMaterial({ color: 0xffffff });
        groundMat.color.setHSL(0.095, 1, 0.75);

        this.mesh.geometry = groundGeo;
        this.mesh.material = groundMat;
        
        // ground.position.y = - 33;
        // ground.rotation.x = - Math.PI / 2;
        this.mesh.receiveShadow = true;
        // scene.add( ground );

        // const geometry = new PlaneGeometry(30,30);
        // const material = new MeshBasicMaterial({
        //     // map: texture,
        // });
        // this.mesh.geometry = geometry;
        // this.mesh.material = material;
        this.transform.eulerRotation = new Euler(-Math.PI/2,0,0)

        // Make invisible plane for the raycast
        const invisbleGeo = new PlaneBufferGeometry(10000, 10000);
        const invisibleMat = new MeshBasicMaterial({ color: 0xffffff, alphaTest: 0, visible: false });
        const invisiblePlane = new Mesh(invisbleGeo, invisibleMat)

        this.mesh.add(invisiblePlane)
    }

    onMouseDown() {
        Drag.startDragCheck();
    }

    onMouseUp() {
        if(!Drag.checkDrag()) {
            EventSystem.fire(EventType.GroundClicked)
        }
    }
}