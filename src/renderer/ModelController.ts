import Controller from "./Controller"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader"
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import EventSystem, { EventType } from "./utils/EventSystem";
import { Object3D, Vector3, Box3, Group, BoxHelper, Color, Euler } from "three";

export default class ModelController extends Controller {
    load(model: string, material: string, rotation = new Euler(0,0,0)) {
        return new Promise((resolve, reject) => {
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

                    object.traverse((child) => {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    })
                    
                    if (window.location.pathname === '/playground') {
                        const pivot = new Group()
                        pivot.castShadow = true
                        pivot.receiveShadow = true
                        pivot.add(object)
                        object.rotation.copy(rotation)
                        this.mesh.add(pivot);
                    } else {
                        object.rotation.copy(rotation)
                        this.mesh.add(object)
                    }

                    // this.mesh.add(object);

                    // console.log(pivot)

                    // const size = new Vector3()
                    // new Box3().setFromObject(object).getSize(size)
                    // this.mesh.geometry.computeBoundingBox()
                    // console.log(this.mesh,{
                    //     x: Math.ceil(size.x),
                    //     y: Math.ceil(size.y),
                    //     z: Math.ceil(size.z),
                    // })

                    EventSystem.fire(EventType.ModelLoaded, model);
                    resolve(model)
                })
            })
        })
    }

    clear() {
        this.mesh.children = [];
    }
}