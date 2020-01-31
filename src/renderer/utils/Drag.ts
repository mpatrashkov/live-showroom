import GameManager from "../Renderer";

export interface DeltaDrag {
    x: number,
    y: number
}

type DragListener = (deltaDrag: DeltaDrag) => void

export default class Drag {
    public static deltaDrag: DeltaDrag;
    private static previousMousePosition = {
        x: 0,
        y: 0
    };

    private static listeners: DragListener[] = [];

    public static isDragging = false;

    private static hasDragged = false;

    public static startDragCheck() {
        Drag.hasDragged = false;
    }

    public static checkDrag() {
        return Drag.hasDragged;
    }

    public static setup(renderer: GameManager) {
        renderer = renderer;
        renderer.getDOMElement().addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.resetDragState(e);
        });
        renderer.getDOMElement().addEventListener('mousemove', (e) => {
            if(this.isDragging) {
                Drag.hasDragged = true;
                this.deltaDrag = {
                    x: e.offsetX - this.previousMousePosition.x,
                    y: e.offsetY - this.previousMousePosition.y
                };

                this.previousMousePosition = {
                    x: e.offsetX,
                    y: e.offsetY
                };

                this.listeners.forEach(listener => listener(this.deltaDrag))
            }
        });

        renderer.getDOMElement().addEventListener('mouseup', (e) => {
            this.isDragging = false;
            this.resetDragState(e);
        });
    }

    public static onDrag(listener: DragListener) {
        this.listeners.push(listener);
    }

    private static resetDragState(e: MouseEvent) {
        this.deltaDrag = {
            x: 0,
            y: 0
        }

        this.previousMousePosition = {
            x: e.offsetX,
            y: e.offsetY
        }
    }
}