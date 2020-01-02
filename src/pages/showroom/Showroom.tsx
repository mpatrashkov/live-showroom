import React from 'react';
import "./showroom.scss"
import CubeController from '../../renderer/CubeController';
import GameManager from '../../renderer/Renderer';
import FloorController from '../../renderer/FloorController';
import CameraController from '../../renderer/CameraController';

import { MeshBasicMaterial, Vector3, Mesh, Color, DirectionalLight, HemisphereLight, PointLight, BackSide, BoxGeometry, CubeTextureLoader } from 'three';
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import ModelController from '../../renderer/ModelController';
import OrbitalController from '../../renderer/OrbitableController';
import LightController from '../../renderer/LightController';
import DevInspector from '../../components/header/DevInspector';
import { TextureLoader } from 'three'
import { render } from '@testing-library/react';

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

        const master = renderer.addEntity("master");
        const cameraController = master.addController(CameraController);
        cameraController.offset = new Vector3(0, 0.5, 2);

        const sun = renderer.addEntity("sun");
        sun.addController(LightController);

        const cube = renderer.addEntity("cube");
        cube.addController(OrbitalController).cameraController = cameraController;
        cube.addController(ModelController).load("z9a.obj", "z9a.mtl")
        //cube.transform.position.x += 20;
        // const cubeController = cube.addController(CubeController);
        // cubeController.cameraController = cameraController;

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
        wall.mesh.material = new MeshBasicMaterial({ color: 0xbbffbb });

        const wall1 = renderer.addEntity("wall1");
        wall1.addController(CubeController);
        wall1.transform.position.x = -15;
        wall1.transform.position.y = 4.5;
        wall1.mesh.scale.y = 30;
        wall1.mesh.scale.z = 30;
        wall1.mesh.material = new MeshBasicMaterial({ color: 0xccffcc });

        const wall2 = renderer.addEntity("wall2");
        wall2.addController(CubeController);
        wall2.transform.position.z = -15;
        wall2.transform.position.y = 4.5;
        wall2.mesh.scale.y = 30;
        wall2.mesh.scale.x = 30;
        wall2.mesh.material = new MeshBasicMaterial({ color: 0xddffdd });

        const wall3 = renderer.addEntity("wall3");
        wall3.addController(CubeController);
        wall3.transform.position.z = 15;
        wall3.transform.position.y = 4.5;
        wall3.mesh.scale.y = 30;
        wall3.mesh.scale.x = 30;
        wall3.mesh.material = new MeshBasicMaterial({ color: 0xeeffee });

        const color = 0xFFFFFF;
        const intensity = 1;
        const light1 = new DirectionalLight(color, intensity);
        light1.position.set(2, 100, 2);
        light1.target.position.set(-5, 0, 0);
        renderer.scene.add(light1);
        renderer.scene.add(light1.target);

        var light = new PointLight( 0xffbb73, 1, 100 );
        light.position.set( 10, 10, 2 );
        renderer.scene.add( light );

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