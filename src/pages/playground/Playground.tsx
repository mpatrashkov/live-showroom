import React from "react"
import GameManager from "../../renderer/Renderer";
import SunController from "../../renderer/SunController";
import { Vector3, Box3, Quaternion, Vector2 } from "three";
import GroundController from "../../renderer/GroundController";
import TestCubeController from "../../renderer/TestCubeController";
import DesignCameraController from "../../renderer/design-camera/DesignCameraController";
import Controller from "../../renderer/Controller";
import EditableController from "../../renderer/editing/EditableController";
import TestLine from "../../renderer/grid/TestLine";
import GridController from "../../renderer/grid/GridController";

import "./playground.scss"
import { Radio, Button } from "antd";
import EventSystem, { EventType } from "../../renderer/utils/EventSystem";
import { RadioChangeEvent } from "antd/lib/radio";
import { serverUrl } from "../../config/config";
import withUserContext from "../../hocs/WithUserContext";
import OrbitableController from "../../renderer/OrbitableController";
import ModelController from "../../renderer/ModelController";
import { Redirect } from "react-router-dom";
import WallController from "../../renderer/WallController";
import RoomController from "../../renderer/RoomController";
import MovableController from "../../renderer/editing/MovableController";
import Entity from "../../renderer/Entity";

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
    gridEntity: any,
    ground: any
}

class Playground extends React.Component<PlaygroundProperties, PlaygroundState> {
    mount: HTMLDivElement

    state = {
        editMode: false,
        inventory: [],
        renderer: null,
        gridEntity: null,
        ground: null
    }

    async componentDidMount() {
        let modelsAsRequest = await fetch(`${serverUrl}/model/inventory/get/${this.props.userId}`)
        let modelsAsJSON = await modelsAsRequest.json();
        let models = await modelsAsJSON.inventory;

        let roomAsRequest = await fetch(`${serverUrl}/auth/room/${this.props.userId}`)
        let roomAsJSON = await roomAsRequest.json();
        let roomDesign = await roomAsJSON.room;

        this.setState({ inventory: models })

        const renderer = new GameManager(this.mount);
        renderer.start();

        const master = renderer.addEntity("master");
        const cameraController = master.addController(DesignCameraController);

        const sun = renderer.addEntity("sun");
        sun.addController(SunController);

        const ground = renderer.addEntity("ground");
        ground.addController(GroundController);

        const gridEntity = renderer.addEntity("grid")
        gridEntity.addController(GridController)
        gridEntity.mesh.visible = false

        // const cube = renderer.addEntity("cube");
        // cube.addController(TestCubeController)
        // let editableController = cube.addController(EditableController)
        // editableController.ground = ground
        // editableController.gridEntity = gridEntity

        const room = renderer.addEntity("room")
        const roomController = room.addController(RoomController)
        roomController.gridEntity = gridEntity

        if (roomDesign) {
            roomDesign.forEach(async (e) => {
                console.log(e)
                const object = Controller.manager.addEntity(e.name)
                let path, material;
                models.forEach(m => {
                    if (m.name === e.name) {
                        path = m.path;
                        material = m.material
                    }
                })
                
                let objectModelController = object.addController(ModelController)
                
                let m = await objectModelController.load(path, material)       
                
                const editableController = object.addController(EditableController)
                
                editableController.ground = this.state.ground
                editableController.gridEntity = this.state.gridEntity

                Controller.manager.nextFrame(() => {
                    let movable = object.getController(MovableController)
                    movable.gridPosition = new Vector2(e.gridPosition.x, e.gridPosition.y)
                    object.transform.rotation = new Quaternion(e.rotation._x, e.rotation._y, e.rotation._z, e.rotation._w);
                })

                
                console.log(e.position, object.transform.position)
                console.log(object)
            });
        }

        if (models.length > 0 && !renderer.findEntityByName(models[0].name) && !roomDesign) {
            const cube = renderer.addEntity(models[0].name);
            let cubeModelController = cube.addController(ModelController);
            await cubeModelController.load(models[0].path, models[0].material)

            const editableController = cube.addController(EditableController)
            editableController.ground = ground
            editableController.gridEntity = gridEntity

        }

        EventSystem.on(EventType.EditModeChange, () => {
            this.setState({
                editMode: !this.state.editMode
            })
        })
        
        this.setState({ renderer, gridEntity, ground })
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
                <div className="playground-save">
                    <Button type="primary" onClick={this.onSave}>Save</Button>
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

    onAddModel = async (model: any) => {
        const object = Controller.manager.addEntity(model.name)

        let objectModelController = object.addController(ModelController)
        let m = await objectModelController.load(model.path, model.material)

        if (m === model.path) {
            const editableController = object.addController(EditableController)
            editableController.ground = this.state.ground
            editableController.gridEntity = this.state.gridEntity
        }
    }

    onSave = async () => {
        let entities = []
        this.state.renderer?.entities.forEach((e: Entity) => {
            if (e.getController(MovableController)) {
                
                const found = this.state.inventory.find(em => em.name === e.name)
                console.log(found)
                let movable = e.getController(MovableController)
                let entity = {
                    gridPosition: movable.gridPosition,
                    position: e.transform.position,
                    rotation: e.transform.rotation,
                    path: found.path,
                    material: found.material,
                    name: e.name
                }
                entities.push(entity)
            }
        })
        let json = JSON.stringify({ entities })
        console.log(json)
        let roomAsRequest = await fetch(`${serverUrl}/auth/room/add/${this.props.userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: json
        })
        let roomAsJSON = await roomAsRequest.json();
        console.log(roomAsJSON)
    }
}

export default withUserContext(Playground)