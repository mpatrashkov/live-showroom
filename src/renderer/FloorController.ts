import Controller from "./Controller";
import { BoxGeometry, MeshBasicMaterial, PlaneGeometry, Euler, TextureLoader, MeshLambertMaterial, Vector2, RepeatWrapping } from "three";

export default class FloorController extends Controller {
    start() {
        const textureDensity = 3;

        const texture = new TextureLoader().load("https://4.imimg.com/data4/TH/BP/MY-3237367/texture-laminate-500x500.jpg");
        // const texture = new TextureLoader().load("https://images.homedepot-static.com/productImages/4ac1c159-5ba5-4a66-8b8f-006a23cb9a5c/svn/lowell-ash-wilsonart-laminate-sheets-7994383503696-64_1000.jpg");
        texture.repeat = new Vector2(this.mesh.scale.x * textureDensity, this.mesh.scale.y * textureDensity);
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;

        const geometry = new PlaneGeometry(11,11);
        const material = new MeshBasicMaterial({
            map: texture,
        });
        this.mesh.geometry = geometry;
        this.mesh.material = material;
        this.transform.eulerRotation = new Euler(-Math.PI/2,0,0)
    }

    update() {

    }

    onClick() {
        console.log(2);
    }
}