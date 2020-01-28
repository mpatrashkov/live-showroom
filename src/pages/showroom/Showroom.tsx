import React from 'react';
import "./showroom.scss"
import CubeController from '../../renderer/CubeController';
import GameManager from '../../renderer/Renderer';
import FloorController from '../../renderer/FloorController';
import CameraController from '../../renderer/CameraController';

import { MeshBasicMaterial, Vector3, DirectionalLight, PointLight, CubeTextureLoader, RepeatWrapping, WebGLRenderer, Scene, PerspectiveCamera, BoxGeometry, Mesh } from 'three';
import ModelController from '../../renderer/ModelController';
import OrbitalController from '../../renderer/OrbitableController';
import LightController from '../../renderer/LightController';
import DevInspector from '../../components/dev-inspector/DevInspector';
import { TextureLoader } from 'three'
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader"
import fs from 'fs'
import EventSystem, { EventType } from '../../renderer/utils/EventSystem';
import Entity from '../../renderer/Entity'; 
 
interface ShowroomState {
    renderer: GameManager | null,
    defaultModels: Array<any>,
    modelIsClicked: boolean,
    clickedModel: any | null,
    catalog: Array<any>,
    loadCounter: number
}

export default class Showroom extends React.Component<{}, ShowroomState> {
    mount: any;
    state = {
        renderer: null,
        defaultModels: new Array(),
        modelIsClicked: false,
        clickedModel: null,
        catalog: new Array(),
        loadCounter: 0
    };

    async componentDidMount() {
        let defaultModelsRequest = await fetch("http://localhost:9999/model/default")
        let defaultModelsJSON = await defaultModelsRequest.json()
        let defaultModels = await defaultModelsJSON.models
        this.setState({
            defaultModels
        })

        const renderer = new GameManager(this.mount);
        const loader = new CubeTextureLoader()
        renderer.start();
        const texture = loader.load([
            process.env.PUBLIC_URL + '/assets/textures/sh_ft.png',
            process.env.PUBLIC_URL + '/assets/textures/sh_bk.png',
            process.env.PUBLIC_URL + '/assets/textures/sh_up.png',
            process.env.PUBLIC_URL + '/assets/textures/sh_dn.png',
            process.env.PUBLIC_URL + '/assets/textures/sh_rt.png',
            process.env.PUBLIC_URL + '/assets/textures/sh_lf.png',
        ])
        renderer.scene.background = texture;

        const tileTexture = new TextureLoader().load(process.env.PUBLIC_URL + '/assets/textures/how-to-texture-a-wall-with-a-roller-design-modern-painting-wall-texture-roller.jpg');
        tileTexture.wrapS = RepeatWrapping;
        tileTexture.wrapT = RepeatWrapping;
        tileTexture.repeat.set(4, 4);
        const tileMaterial = new MeshBasicMaterial({
            map: tileTexture,
        });

        const master = renderer.addEntity("master");
        const cameraController = master.addController(CameraController);
        cameraController.offset = new Vector3(0, 5, 7);

        const sun = renderer.addEntity("sun");
        sun.addController(LightController);

        EventSystem.on(EventType.OrbitableClicked, (name) => {
            for (let i = 0; i < this.state.defaultModels.length; i++) {
                if (this.state.defaultModels[i].name == name) {
                    this.setState({ modelIsClicked: true, clickedModel: this.state.defaultModels[i] })
                    return
                } else {
                    this.setState({ modelIsClicked: false, loadCounter: 0 })
                }
            }
        })

        this.state.defaultModels.forEach((m) => {
            const cube = renderer.addEntity(m.name);
            cube.addController(OrbitalController).cameraController = cameraController;
            let cubeModelController = cube.addController(ModelController);
            cubeModelController.load(m.path, m.material)
            if (m.type == "Sofa") {
                cube.transform.position.z = -2;
                cube.transform.position.x = 12;
            } else if (m.type == "Dinner Table") {
                cube.transform.position.z = -4.5;
            } else if (m.type == "Garden Chair") {
                cube.transform.position.x = 8;
                cube.transform.position.z = -10;

            }
        })

        const floor = renderer.addEntity("floor");
        floor.mesh.receiveShadow = true;
        const floorController = floor.addController(FloorController);
        floor.transform.position.y = -0.5;
        floorController.cameraController = cameraController;

        const wall = renderer.addEntity("wall");
        wall.addController(CubeController);
        wall.transform.position.x = 15;
        wall.transform.position.y = 4.5;
        wall.mesh.scale.y = 30;
        wall.mesh.scale.z = 30;
        wall.mesh.material = tileMaterial

        const wall1 = renderer.addEntity("wall1");
        wall1.addController(CubeController);
        wall1.transform.position.x = -15;
        wall1.transform.position.y = 4.5;
        wall1.mesh.scale.y = 30;
        wall1.mesh.scale.z = 30;
        wall1.mesh.material = tileMaterial

        const wall2 = renderer.addEntity("wall2");
        wall2.addController(CubeController);
        wall2.transform.position.z = -15;
        wall2.transform.position.y = 4.5;
        wall2.mesh.scale.y = 30;
        wall2.mesh.scale.x = 30;
        wall2.mesh.material = tileMaterial

        const wall3 = renderer.addEntity("wall3");
        wall3.addController(CubeController);
        wall3.transform.position.z = 15;
        wall3.transform.position.y = 4.5;
        wall3.mesh.scale.y = 30;
        wall3.mesh.scale.x = 30;
        wall3.mesh.material = tileMaterial

        const ceilingTexture = new TextureLoader().load(process.env.PUBLIC_URL + '/assets/textures/2c3e4b5d02556650294e3aba3aec5023.jpg');
        ceilingTexture.wrapS = RepeatWrapping;
        ceilingTexture.wrapT = RepeatWrapping;
        ceilingTexture.repeat.set(3, 3);
        const ceilingMaterial = new MeshBasicMaterial({
            map: ceilingTexture,
        });

        const ceiling = renderer.addEntity("ceiling");
        ceiling.addController(CubeController);
        ceiling.transform.position.y = 20;
        ceiling.mesh.scale.x = 30.5
        ceiling.mesh.scale.z = 30.5
        ceiling.mesh.material = ceilingMaterial;

        const objLoader = new OBJLoader()
        objLoader.load(process.env.PUBLIC_URL + '/assets/objects/Door.obj', function (door) {
            door.scale.x = 0.05
            door.scale.y = 0.05
            door.scale.z = 0.05
            door.position.z = 14.5
            door.position.y = -0.5
            door.position.x = -7
            renderer.scene.add(door)
        })

        const color = 0xFFFFFF;
        const intensity = 1;
        const light1 = new DirectionalLight(color, intensity);
        light1.position.set(2, 100, 2);
        light1.target.position.set(-5, 0, 0);
        renderer.scene.add(light1);
        renderer.scene.add(light1.target);

        var light = new PointLight(0xffbb73, 1, 100);
        light.position.set(10, 10, 2);
        renderer.scene.add(light);

        this.setState({
            renderer: renderer
        });
    }

    render() {
        return (
            <div className="page showroom">
                <div ref={el => this.mount = el}></div>
                <div className="catalog" style={(this.state.modelIsClicked) ? {"display": "block"} : null}>
                    {
                        this.state.modelIsClicked ?
                            this.state.catalog.map(m => {
                                return (<div className="catalog-element">
                                    <h1>{m.name}</h1>
                                    <div className="catalog-element-img" onClick={() => this.clickHandler(m._id)}>
                                        <img src={m.image} />
                                    </div>
                                </div>)
                            }) : null
                    }
                </div>
                <DevInspector renderer={this.state.renderer} />
            </div>
        )
    }

    clickHandler = async (id) => {
        let modelAsRequest = await fetch(`http://localhost:9999/model/get/${id}`)
        let modelAsJSON = await modelAsRequest.json();
        let model = await modelAsJSON.model;
        console.log(model)

        let entity = this.state.renderer.findEntityByName(this.state.clickedModel.name);
        let modelController = entity.getController(ModelController)
        modelController.clear()
        modelController.load(model.path, model.materials[0].path)
    }

    async componentDidUpdate() {
        if (this.state.modelIsClicked && this.state.loadCounter === 0) {
            let modelAsRequest = await fetch(`http://localhost:9999/type/models/${this.state.clickedModel.type}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            let modelsAsJSON = await modelAsRequest.json()
            let models = await modelsAsJSON.models;
            this.setState({
                catalog: models,
                loadCounter: 1
            })
        }
    }
}