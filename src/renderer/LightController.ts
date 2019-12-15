import Controller from "./Controller"
import { AmbientLight, PointLight } from "three"

export default class LightController extends Controller {
    setup() {
        const light = new PointLight(0xffffff, 0.5);
        light.position.setY(100);
        this.mesh.add(light);
    }
}