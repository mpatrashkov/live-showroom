import React from "react"
import GameManager from "../../renderer/Renderer";
import SunController from "../../renderer/SunController";
import { Vector3 } from "three";
import GroundController from "../../renderer/GroundController";
import TestCubeController from "../../renderer/TestCubeController";
import DesignCameraController from "../../renderer/design-camera/DesignCameraController";
import Controller from "../../renderer/Controller";
import EditableController from "../../renderer/editing/EditableController";
import TestLine from "../../renderer/grid/TestLine";
import GridController from "../../renderer/grid/GridController";

import "./playground.scss"
import { Radio } from "antd";
import EventSystem, { EventType } from "../../renderer/utils/EventSystem";
import { RadioChangeEvent } from "antd/lib/radio";

class Playground extends React.Component {
    mount: HTMLDivElement

    state = {
        editMode: false
    }

    componentDidMount() {
        const renderer = new GameManager(this.mount);
        renderer.start();

        const master = renderer.addEntity("master");
        const cameraController = master.addController(DesignCameraController);

        const sun = renderer.addEntity("sun");
        sun.addController(SunController);

        const ground = renderer.addEntity("ground");
        ground.addController(GroundController);

        const grid = renderer.addEntity("grid")
        grid.addController(GridController)
        grid.mesh.visible = false

        const cube = renderer.addEntity("cube");
        cube.addController(TestCubeController).transform.position = new Vector3(0, 1, -5);
        const editableController = cube.addController(EditableController)
        editableController.ground = ground
        editableController.grid = grid

        EventSystem.on(EventType.EditModeChange, () => {
            this.setState({
                editMode: !this.state.editMode
            })
        })
    }

    render() {
        return (
            <div className="page playground">
                <div ref={el => this.mount = el}></div>
                <div className="playground-toolbar">
                    <Radio.Group defaultValue="move" buttonStyle="solid" onChange={this.onEditModeChange}>
                        <Radio.Button value="move">Move</Radio.Button>
                        <Radio.Button value="rotate">Rotate</Radio.Button>
                    </Radio.Group>
                </div>
            </div>
        )
    }

    onEditModeChange = (e: RadioChangeEvent) => {
        EventSystem.fire(EventType.EditModeChange, e.target.value)
    }
}

export default Playground