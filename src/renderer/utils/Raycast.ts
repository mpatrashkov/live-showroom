import { Vector2, PerspectiveCamera, Raycaster, Object3D, Vector3 } from "three";
import Controller from "../Controller";
import Entity from "../Entity";

export type RaycastHit = {
    entity: Entity,
    point: Vector3
}

export default class Raycast {
    public static fromCamera(mousePosition: Vector2, pool: Entity[] = [], camera: PerspectiveCamera = Controller.mainCamera): RaycastHit | null {
        const raycast = new Raycaster();
        raycast.setFromCamera(mousePosition, camera);
        const intersects = raycast.intersectObjects(Controller.scene.children, true);

        for(let intersect of intersects) {
            const hitEntity = Controller.manager.findEntityByName(intersect.object.name);
            if(hitEntity) {
                if(pool.length === 0 || pool.includes(hitEntity)) {
                    return {
                        entity: hitEntity,
                        point: intersect.point
                    };
                }
            }
        }

        return null;
    }
}