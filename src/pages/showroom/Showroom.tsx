import React from 'react';
import "./showroom.scss"
import CubeController from '../../renderer/CubeController';
import Renderer from '../../renderer/Renderer';
import FloorController from '../../renderer/FloorController';
import CameraController from '../../renderer/CameraController';
import { MeshBasicMaterial, Vector3 } from 'three';
import LightController from '../../renderer/LightController';

export default class Showroom extends React.Component {
    mount: any;

    componentDidMount() {
        const renderer = new Renderer(this.mount);
        renderer.start();

        const master = renderer.addEntity("master");
        const cameraController = master.addController(CameraController);
        cameraController.offset = new Vector3(0, 0.5, 2);

        const sun = renderer.addEntity("sun");
        sun.addController(LightController);

        const cube = renderer.addEntity("cube");
        cube.transform.position.x += 20;
        const cubeController = cube.addController(CubeController);
        cubeController.cameraController = cameraController;

        const floor = renderer.addEntity("floor");
        floor.addController(FloorController);
        floor.transform.position.y = -0.5;
        
        const wall = renderer.addEntity("wall");
        wall.addController(CubeController);
        wall.transform.position.x = 5;
        wall.transform.position.y = 4.5;
        wall.mesh.scale.y = 10;
        wall.mesh.scale.z = 10;
        wall.mesh.material = new MeshBasicMaterial( { color: 0xbbffbb } );

        const wall1 = renderer.addEntity("wall1");
        wall1.addController(CubeController);
        wall1.transform.position.x = -5;
        wall1.transform.position.y = 4.5;
        wall1.mesh.scale.y = 10;
        wall1.mesh.scale.z = 10;
        wall1.mesh.material = new MeshBasicMaterial( { color: 0xccffcc } );

        const wall2 = renderer.addEntity("wall2");
        wall2.addController(CubeController);
        wall2.transform.position.z = -5;
        wall2.transform.position.y = 4.5;
        wall2.mesh.scale.y = 10;
        wall2.mesh.scale.x = 10;
        wall2.mesh.material = new MeshBasicMaterial( { color: 0xddffdd } );

        const wall3 = renderer.addEntity("wall3");
        wall3.addController(CubeController);
        wall3.transform.position.z = 5;
        wall3.transform.position.y = 4.5;
        wall3.mesh.scale.y = 10;
        wall3.mesh.scale.x = 10;
        wall3.mesh.material = new MeshBasicMaterial( { color: 0xeeffee } );
    }

    render() {
        return (
            <div className="page showroom" ref={el => this.mount = el}></div>
        )
    }
}