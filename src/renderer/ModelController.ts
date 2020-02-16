import Controller from "./Controller"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader"
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import EventSystem, { EventType } from "./utils/EventSystem";
import { Object3D, Vector3, Box3, Group, BoxHelper, Color } from "three";

export default class ModelController extends Controller {
    load(model: string, material: string) {
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

                    const pivot = new Group()
                    pivot.castShadow = true
                    pivot.receiveShadow = true
                    pivot.add(object)
                    
                    Controller.manager.nextFrame(() => {
                        const size = new Vector3()
                        const box = new Box3().setFromObject(object.children[0])
                        box.getSize(size)
                        
                        const center = box.min.clone().sub(box.max).divideScalar(2).add(box.max)
                        console.log(center.clone())
                        center.setY(0)
                        object.position.copy(center.multiplyScalar(-1))
                    })
                    
                    
                    this.mesh.add(pivot);
                    this.mesh.add(new BoxHelper(this.mesh, new Color(0x00ffff)))
                    
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