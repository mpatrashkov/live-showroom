import React from "react"
import GameManager from "../../renderer/Renderer";
import SunController from "../../renderer/SunController";
import { Vector3, Box3 } from "three";
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
import { serverUrl } from "../../config/config";
import withUserContext from "../../hocs/WithUserContext";
import OrbitableController from "../../renderer/OrbitableController";
import ModelController from "../../renderer/ModelController";
import { Redirect } from "react-router-dom";

interface PlaygroundProperties {
    updateUser: Function,
    userId: string,
    username: string,
    isAdmin: boolean,
    isLoggedIn: boolean
}

interface PlaygroundState {
    editMode: boolean,
    inventory: Array<any>,
    renderer: GameManager,
    grid: any,
    ground: any
}

class Playground extends React.Component<PlaygroundProperties, PlaygroundState> {
    mount: HTMLDivElement

    state = {
        editMode: false,
        inventory: [],
        renderer: null,
        grid: null,
        ground: null
    }

    async componentDidMount() {
        let modelsAsRequest = await fetch(`${serverUrl}/model/inventory/get/${this.props.userId}`)
        let modelsAsJSON = await modelsAsRequest.json();
        let models = await modelsAsJSON.inventory;
        console.log(models)

        this.setState({ inventory: models })

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

        console.log(models)

        if (models.length > 0 && !renderer.findEntityByName(models[0].name)) {
            const cube = renderer.addEntity(models[0].name);
            let cubeModelController = cube.addController(ModelController);
            cubeModelController.load(models[0].path, models[0].material)
            EventSystem.on(EventType.ModelLoaded, () => {
                const editableController = cube.addController(EditableController)
                editableController.ground = ground
                editableController.grid = grid
            })

        }

        EventSystem.on(EventType.EditModeChange, () => {
            this.setState({
                editMode: !this.state.editMode
            })
        })

        this.setState({renderer, grid,ground})

    }

    render() {
        if (!this.props.isLoggedIn) {
            return (
                <Redirect to="/" />
            )
        }

        return (
            <div className="page playground">
                <div ref={el => this.mount = el}></div>
                <div className="playground-toolbar">
                    <Radio.Group defaultValue="move" buttonStyle="solid" onChange={this.onEditModeChange}>
                        <Radio.Button value="move">Move</Radio.Button>
                        <Radio.Button value="rotate">Rotate</Radio.Button>
                    </Radio.Group>
                </div>
                <div className="playground-inventory" style={(this.state.inventory.length > 0) ? { "display": "block" } : null}>
                    {
                        this.state.inventory.map((m) => (
                            <div className="playground-inventory-item">
                                <h3>{m.name}</h3>
                                <div className="playground-inventory-item-img" onClick={() => this.onAddModel(m)}>
                                    <img src={m.image} alt="" />
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        )
    }

    onEditModeChange = (e: RadioChangeEvent) => {
        EventSystem.fire(EventType.EditModeChange, e.target.value)
    }

    onAddModel = (model: any) => {
        const object = this.state.renderer.addEntity(model.name)
        
        let objectModelController = object.addController(ModelController)
        objectModelController.load(model.path, model.material)
        EventSystem.on(EventType.ModelLoaded, (m) => {
            if(m === model.path) {
                const editableController = object.addController(EditableController)
                editableController.ground = this.state.ground
                editableController.grid = this.state.grid
                object.transform.position.x = -12;
                object.transform.position.z = -14;
            }
        })
    }
}

export default withUserContext(Playground)