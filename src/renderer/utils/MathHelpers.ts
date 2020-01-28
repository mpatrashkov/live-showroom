export default class MathHelpers {
    public static between(x: number, min: number, max: number) {
        if(x < min) {
            x = min;
        }
        else if(x > max) {
            x = max;
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
}