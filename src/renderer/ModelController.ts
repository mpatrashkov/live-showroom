import Controller from "./Controller"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader"
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import EventSystem, { EventType } from "./utils/EventSystem";
import { Vector3, Box3 } from "three";

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

                // const size = new Vector3()
                // new Box3().setFromObject(object).getSize(size)
                // this.mesh.geometry.computeBoundingBox()
                // console.log(this.mesh,{
                //     x: Math.ceil(size.x),
                //     y: Math.ceil(size.y),
                //     z: Math.ceil(size.z),
                // })

                EventSystem.fire(EventType.ModelLoaded, model);
            })  
        })
    }

    clear() {
        this.mesh.children = [];
    }
}