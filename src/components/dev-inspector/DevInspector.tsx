import React, { Component } from "react";
import GameManager from "../../renderer/Renderer";
import "./dev-inspector.scss";
import Entity from "../../renderer/Entity";
import { PerspectiveCamera } from "three";
import DevCameraController from "../../renderer/DevCameraController";

interface DevInspectorProps {
    renderer: GameManager | null;
}

interface DevInspectorState {
    selectedEntities: string[]
}

class DevInspector extends Component<DevInspectorProps, DevInspectorState> {
    camera: PerspectiveCamera;
    devCamera: Entity | null = null;
    devCameraController: DevCameraController | null = null;
    entities: Entity[] = [];

    constructor(props: DevInspectorProps) {
        super(props);

        this.state = {
            selectedEntities: []
        }

        this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.y += 15;
        this.camera.rotation.x = -90;
    }

    componentDidMount() {
        document.addEventListener("keydown", this.shortcutsHandler, false);
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this.shortcutsHandler, false);
    }

    componentDidUpdate() {
        if (!this.devCamera && this.props.renderer) {
            this.devCamera = this.props.renderer.addEntity("DevCamera");
            this.devCameraController = this.devCamera.addController(DevCameraController);
        }
    }

    shortcutsHandler = (event: KeyboardEvent) => {
        if (event.key === "f") {
            this.goToSelectedEntity();
        }
        if (event.key === "Delete") {
            this.deleteSelectedEntities();
        }
    }

    toggleCamera = () => {
        this.devCameraController?.toggle();
    }

    goToSelectedEntity = () => {
        const entity = this.entities.find(item => item.mesh.uuid === this.state.selectedEntities[0]);

        if (entity) {
            this.devCameraController?.toggle("on");
            this.devCameraController?.setTarget(entity);
        }
    }

    deleteSelectedEntities = () => {
        const entitiesToRemove = this.entities.filter(entity => this.state.selectedEntities.includes(entity.mesh.uuid));
        entitiesToRemove.forEach(entity => entity.destroy());
        this.forceUpdate();
    }

    onEntityClick = (entity: Entity) => {
        if (this.isEntitySelected(entity)) {
            this.setState(state => ({
                selectedEntities: state.selectedEntities.filter(item => item !== entity.mesh.uuid)
            }))
        }
        else {
            this.setState(state => ({
                selectedEntities: [
                    ...state.selectedEntities,
                    entity.mesh.uuid
                ]
            }))
        }
    }

    isEntitySelected = (entity: Entity) => {
        return this.state.selectedEntities.includes(entity.mesh.uuid);
    }

    render() {
        if (this.props.renderer) {
            this.entities = this.props.renderer.entities;
        }

        return (
            <div className="inspector-tree">
                <div className="inspector-list">
                    {this.entities.map((value, index) =>
                        <div key={index} className={"inspector-tree-node" + (this.isEntitySelected(value) ? " selected" : "")} onClick={() => this.onEntityClick(value)}>{value.name}</div>
                    )}
                </div>
                <div className="inspector-actions">
                    <button onClick={() => this.toggleCamera()}>Toggle Camera</button>
                </div>
            </div>
        )
    }
}

export default DevInspector;