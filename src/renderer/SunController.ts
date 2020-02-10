import Controller from "./Controller";
import { DirectionalLight, HemisphereLight } from "three";

export default class SunController extends Controller {
    start() {
        const directionalLight = new DirectionalLight(0xffffff, 1);
        // directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
        directionalLight.color.setHSL(0.1, 1, 0.95);
        directionalLight.position.set(-1, 1.75, 1);
        directionalLight.position.multiplyScalar(30);

        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;

        const d = 50;
        directionalLight.shadow.camera.left = - d;
        directionalLight.shadow.camera.right = d;
        directionalLight.shadow.camera.top = d;
        directionalLight.shadow.camera.bottom = - d;
                
        this.mesh.add(directionalLight);

        const light = new HemisphereLight( 0xffffbb, 0x080820, 1 );
        light.position.set(0, 50, 0);
        this.mesh.add(light);
    }
}