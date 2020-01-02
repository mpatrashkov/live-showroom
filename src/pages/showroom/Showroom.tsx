import React from 'react';
import "./showroom.scss"
import CubeController from '../../renderer/CubeController';
import GameManager from '../../renderer/Renderer';
import FloorController from '../../renderer/FloorController';
import CameraController from '../../renderer/CameraController';
import { MeshBasicMaterial, Vector3, BackSide, BoxGeometry, Mesh, CubeTextureLoader, RepeatWrapping, EdgesGeometry, LineSegments, LineBasicMaterial } from 'three';
import LightController from '../../renderer/LightController';
import DevInspector from '../../components/header/DevInspector';
import { TextureLoader } from 'three'
import { render } from '@testing-library/react';
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader"

interface ShowroomState {
    renderer: GameManager | null;
}

export default class Showroom extends React.Component<{}, ShowroomState> {
    mount: any;
    state = {
        renderer: null
    };

    componentDidMount() {
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
        cameraController.offset = new Vector3(0, 1, 2);

        const sun = renderer.addEntity("sun");
        sun.addController(LightController);

        const cube = renderer.addEntity("cube");
        //cube.transform.position.x += 20;
        const cubeController = cube.addController(CubeController);
        cubeController.cameraController = cameraController;

        const floor = renderer.addEntity("floor");
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
        objLoader.load(process.env.PUBLIC_URL + '/assets/objects/Door.obj', function(door) {
            door.scale.x = 0.05
            door.scale.y = 0.05
            door.scale.z = 0.05
            door.position.z = 14.5
            door.position.y = -0.5
            door.position.x = -7
            renderer.scene.add(door)
        })

        this.setState({
            renderer: renderer
        });
    }

    render() {
        return (
            <div className="page showroom">
                <div ref={el => this.mount = el}></div>

                <DevInspector renderer={this.state.renderer} />
            </div>
        )
    }
}