import { Vector3 } from "three";

export default class MathHelpers {
    public static clamp(x: number, min: number, max: number) {
        if(x < min) {
            return min;
        }
        else if(x > max) {
            return max;
        }

        return x;
    }

    public static toRad(angle: number) {
        return angle * Math.PI / 180;
    }

    public static toDeg(angle: number) {
        return angle * 180 / Math.PI;
    }

    public static normalizeAngleRad(angle: number) {
        return angle - 2 * Math.PI * Math.floor((angle + Math.PI) / 2 * Math.PI);
    }

    public static roundVector(vector: Vector3) {
        return new Vector3(
            Math.round(vector.x),
            Math.round(vector.y),
            Math.round(vector.z),
        )
    }
}