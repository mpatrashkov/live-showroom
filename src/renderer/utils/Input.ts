import { Vector2 } from "three";
import GameManager from "../Renderer";

export default class Input {
    public static mousePosition = new Vector2();

    public static setup(renderer: GameManager) {
        const element = renderer.getDOMElement();
        element.onmousemove = function(e) {
            Input.mousePosition = new Vector2(
                (e.clientX / window.innerWidth) * 2 - 1,
                -(e.clientY / window.innerHeight) * 2 + 1
            )
        }
    }
}