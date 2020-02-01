import Controller from "./Controller"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader"
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import EventSystem, { EventType } from "./utils/EventSystem";

export default class ModelController extends Controller {
    load(model: string, material: string) {
        const objLoader = new OBJLoader();
        const mtlLoader = new MTLLoader();
        mtlLoader.load(material, materials => {
            materials.preload();

            objLoader.setMaterials(materials);

            objLoader.load(model, object => {
                object.scale.x = 0.08;
                object.scale.y = 0.08;
                object.scale.z = 0.08;
                object.position.y = -0.5

                object.castShadow = true;
                object.receiveShadow = true;

                this.mesh.add(object);
                EventSystem.fire(EventType.ModelLoaded);
            })  
        })
    }

    clear() {
        this.mesh.children = [];
    }
}