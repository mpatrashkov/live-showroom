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
            const clickEvent = (object: Object3D) => {
                const hitEntity = Controller.manager.findEntityByName(object.name);
                if(hitEntity) {
                    if(pool.length === 0 || pool.includes(hitEntity)) {
                        return {
                            entity: hitEntity,
                            point: intersect.point
                        };
                    }
                }

                if(object.parent) {
                    return clickEvent(object.parent);
                }

                return null;
            }

            const res = clickEvent(intersect.object);
            if(res) {
                return res;
            }
        }

        return null;
    }

    public static getAll(origin: Vector3, direction: Vector3, pool: Entity[] = []): RaycastHit[] {
        const raycast = new Raycaster(origin, direction.normalize());
        const intersects = raycast.intersectObjects(Controller.scene.children, true);

        const hits: RaycastHit[] = [];
        for(let intersect of intersects) {
            const clickEvent = (object: Object3D) => {
                const hitEntity = Controller.manager.findEntityByName(object.name);
                if(hitEntity) {
                    if(pool.length === 0 || pool.includes(hitEntity)) {
                        hits.push({
                            entity: hitEntity,
                            point: intersect.point
                        });
                    }
                }

                if(object.parent) {
                    clickEvent(object.parent);
                }
            }

            clickEvent(intersect.object);
        }

        return hits;
    }
}