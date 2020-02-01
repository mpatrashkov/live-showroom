import Entity from "../Entity";
import Controller from "../Controller";

class Outline {
    private static selectedEntities: Entity[] = [];

    public static outlineSingleEntity(entity: Entity) {
        this.selectedEntities = [entity];
    }

    public static isEntitySelected(entity: Entity) {
        return Outline.selectedEntities.includes(entity);
    }

    public static removeOutline(entity: Entity) {
        const index = Outline.selectedEntities.indexOf(entity);
        if(index > -1) {
            Outline.selectedEntities.splice(index, 1)
        }
    }

    public static getSelectedObjects() {
        return Outline.selectedEntities.map(entity => entity.mesh);
    }
}

export default Outline;