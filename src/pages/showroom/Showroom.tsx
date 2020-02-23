import React from 'react';
import "./showroom.scss"
import CubeController from '../../renderer/CubeController';
import GameManager from '../../renderer/Renderer';
import FloorController from '../../renderer/FloorController';
import CameraController from '../../renderer/camera/CameraController';

import { MeshBasicMaterial, Vector3, DirectionalLight, PointLight, CubeTextureLoader, RepeatWrapping } from 'three';
import ModelController from '../../renderer/ModelController';
import OrbitableController from '../../renderer/OrbitableController';
import LightController from '../../renderer/LightController';
import DevInspector from '../../components/dev-inspector/DevInspector';
import { TextureLoader } from 'three'
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader"
import EventSystem, { EventType } from '../../renderer/utils/EventSystem';
import { serverUrl } from '../../config/config';
import { ProgressBar } from 'react-bootstrap'
import { Button, Popover } from 'antd'
import withUserContext from '../../hocs/WithUserContext';

interface ShowroomState {
    renderer: GameManager | null,
    defaultModels: Array<any>,
    modelIsClicked: boolean,
    clickedModel: any | null,
    catalog: Array<any>,
    loadCounter: number,
    loadedModels: number,
    isButtonDisabled: boolean,
    visible: string
}

interface ShowroomProperties {
    updateUser: Function,
    userId: string,
    username: string,
    isAdmin: boolean,
    isLoggedIn: boolean
}

class Showroom extends React.Component<ShowroomProperties, ShowroomState> {
    mount: any;
    state = {
        renderer: null,
        defaultModels: [],
        modelIsClicked: false,
        clickedModel: null,
        catalog: [],
        loadCounter: 0,
        loadedModels: 0,
        isButtonDisabled: true,
        visible: ''
    };

    async componentDidMount() {
        let defaultModelsRequest = await fetch(`${serverUrl}/model/default`)
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

        cameraController.orbitOffset = new Vector3(0, 5, 7);

        const sun = renderer.addEntity("sun");
        sun.addController(LightController);

        EventSystem.on(EventType.OrbitableClicked, async (name) => {
            for (let i = 0; i < this.state.defaultModels.length; i++) {
                if (this.state.defaultModels[i].name === name) {
                    let modelAsRequest = await fetch(`${serverUrl}/type/models/${this.state.defaultModels[i].type}`)

                    let modelsAsJSON = await modelAsRequest.json()
                    let models = await modelsAsJSON.models;

                    this.setState({
                        modelIsClicked: true, clickedModel: this.state.defaultModels[i], catalog: models,
                        loadCounter: 1
                    })
                    return
                } else {
                    this.setState({ modelIsClicked: false, loadCounter: 0 })
                }
            }
        })

        EventSystem.on(EventType.OrbitableClosed, () => {
            this.setState({ modelIsClicked: false, loadCounter: 0 })
        });

        if (this.state.loadedModels < this.state.defaultModels.length - 1) {
            EventSystem.on(EventType.ModelLoaded, () => {
                let loaded = this.state.loadedModels
                this.setState({
                    loadedModels: loaded + 1
                }, () => {
                    console.log(this.state.loadedModels, this.state.defaultModels.length)
                    if (this.state.loadedModels === this.state.defaultModels.length) {
                        this.setState({
                            isButtonDisabled: false
                        })
                    }
                })
            })
        }



        this.state.defaultModels.forEach((m) => {
            const cube = renderer.addEntity(m.name);
            cube.addController(OrbitableController).cameraController = cameraController;
            let cubeModelController = cube.addController(ModelController);
            if (m.material) {
                cubeModelController.load(m.path, m.material)
            }
            if (m.type === "Sofa") {
                cube.transform.position.z = -2;
                cube.transform.position.x = 12;
            } else if (m.type === "Dinner Table") {
                cube.transform.position.z = -4.5;
                cube.transform.position.x = -6;
            } else if (m.type === "Garden Chair") {
                cube.transform.position.x = 8;
                cube.transform.position.z = -10;
            } else if (m.type === "Armchair") {
                cube.transform.position.x = 10;
                cube.transform.position.z = 3;
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
        wall.transform.position.y = 9.5;
        wall.mesh.scale.y = 20;
        wall.mesh.scale.z = 30;
        wall.mesh.material = tileMaterial

        const wall1 = renderer.addEntity("wall1");
        wall1.addController(CubeController);
        wall1.transform.position.x = -15;
        wall1.transform.position.y = 9.5;
        wall1.mesh.scale.y = 20;
        wall1.mesh.scale.z = 30;
        wall1.mesh.material = tileMaterial

        const wall2 = renderer.addEntity("wall2");
        wall2.addController(CubeController);
        wall2.transform.position.z = -15;
        wall2.transform.position.y = 9.5;
        wall2.mesh.scale.y = 20;
        wall2.mesh.scale.x = 30;
        wall2.mesh.material = tileMaterial

        const wall3 = renderer.addEntity("wall3");
        wall3.addController(CubeController);
        wall3.transform.position.z = 15;
        wall3.transform.position.y = 9.5;
        wall3.mesh.scale.y = 20;
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
                <div className="catalog" style={(this.state.modelIsClicked) ? { "display": "block" } : null} onScroll={() => {this.setState({visible: ''})}}>
                    {
                        this.state.modelIsClicked ?
                            this.state.catalog.map((m, index) =>
                                <div className="catalog-element" key={index}>
                                    <h1>{m.name}</h1>
                                    <div className="catalog-element-img" onClick={() => this.clickHandler(m._id)}>
                                        <img src={m.image} alt="" />
                                    </div>
                                    {
                                        this.props.isLoggedIn ? (
                                            <div className="catalog-element-buttons">
                                                <button className="btn btn-primary" onClick={() => this.clickHandler(m._id)}>Show</button>
                                                <Popover title="Congratulations"
                                                    visible={this.state.visible === m._id}
                                                    placement="rightBottom"
                                                    content="Model Added to Inventory Successfully!">
                                                    <button className="btn btn-success" onClick={() => this.addToInventory(m._id)}>Add to Inventory</button>
                                                </Popover>
                                            </div>
                                        ) : null
                                    }
                                </div>
                            ) : null
                    }
                </div>
                <DevInspector renderer={this.state.renderer} />
                <div className="showroom-start-screen">
                    <h1>Welcome To Our Virtual Showroom</h1>
                    <div className="showroom-info">
                        <p>Step Inside Our Virtual Showroom and Explore the Huge Variety Of Furniture That We Offer.</p>
                        <p>Jump into our virtually created world and choose the furniture that best fits your style. And not only that, you can see how the product you chose looks in a real environment! </p>
                        <p>Quit going around your town visiting every furniture shop, just to find the perfect sofa in the last one. Now you can find everything at one place and even compare them in a perfect world simulation!</p>
                        <p>This is one of the most if not the most intuitive virtual showroom available to the public. With good user experience and interface our showroom offers easy and effective way of exploring the world of interior design.</p>
                    </div>
                    <div className="actions">
                        <ProgressBar animated now={this.state.loadedModels * (100 / this.state.defaultModels.length)} />
                        <Button type="primary" id="enter-btn" disabled={this.state.isButtonDisabled} onClick={this.enterShowroom}>Enter</Button>
                    </div>
                </div>
            </div>
        )
    }

    enterShowroom = () => {
        console.log("hi")
        let div = document.getElementsByClassName("showroom-start-screen")[0];
        div.classList.add("enter-showroom")
        setTimeout(() => {
            div.classList.add("remove-enter-screen")
        }, 300)
    }

    clickHandler = async (id) => {
        let modelAsRequest = await fetch(`${serverUrl}/model/get/${id}`)
        let modelAsJSON = await modelAsRequest.json();
        let model = await modelAsJSON.model;

        let entity = this.state.renderer.findEntityByName(this.state.clickedModel.name);
        let modelController = entity.getController(ModelController)

        modelController.clear()
        modelController.load(model.path, model.materials[0].path)
    }

    addToInventory = async (id) => {
        console.log(id)
        let modelAsRequest = await fetch(`${serverUrl}/model/inventory/add/${this.props.userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({modelId: id})
        })
        let result = await modelAsRequest.json();
        if(result.message) {
            this.setState({ visible: id }, () => {
                setTimeout(() => {
                    this.setState({ visible: '' })
                }, 3000)
            })
        }
    }
}

export default withUserContext(Showroom)