import { Vector2 } from "three";
import GameManager from "../Renderer";

export default class Input {
    public static mousePosition = new Vector2();

    public static setup(renderer: GameManager) {
        const element = renderer.getDOMElement();
        element.onmousemove = function(e) {
            const rect = element.getBoundingClientRect();
            Input.mousePosition = new Vector2(
                ((e.clientX - rect.left) / element.offsetWidth) * 2 - 1,
                -((e.clientY - rect.top) / element.offsetHeight) * 2 + 1
            )
        }
    }
}