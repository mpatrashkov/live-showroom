import Controller from "./Controller"
import { AmbientLight, PointLight, DirectionalLight } from "three"

export default class LightController extends Controller {
    setup() {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new DirectionalLight(color, intensity);
        light.position.set(0, 100, 0);
        light.target.position.set(-5, 0, 0);
        this.mesh.add(light);
        this.mesh.add(light.target);
    }
}