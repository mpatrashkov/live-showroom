import Controller from "./Controller";
import { BoxGeometry, MeshLambertMaterial } from "three";

export default class TestCubeController extends Controller {
    start() {
        const geometry = new BoxGeometry(4, 2, 4);
        const material = new MeshLambertMaterial({ color: 0xffffff });
        this.mesh.geometry = geometry;
        this.mesh.material = material;

        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
    }
}