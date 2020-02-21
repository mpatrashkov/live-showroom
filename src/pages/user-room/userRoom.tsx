import React from 'react'
import withUserContext from '../../hocs/WithUserContext'
import './user-room.scss'
import GameManager from '../../renderer/Renderer';
import { CubeTextureLoader, TextureLoader, RepeatWrapping, MeshBasicMaterial, Vector3, PointLight, DirectionalLight } from 'three';
import CameraController from '../../renderer/camera/CameraController';
import LightController from '../../renderer/LightController';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import CubeController from '../../renderer/CubeController';
import FloorController from '../../renderer/FloorController';
import { serverUrl } from '../../config/config';
import OrbitableController from '../../renderer/OrbitableController';
import ModelController from '../../renderer/ModelController';

interface UserRoomState {
    renderer: GameManager | null
}

interface UserRoomProperties {
    updateUser: Function,
    userId: string,
    username: string,
    isAdmin: boolean,
    isLoggedIn: boolean
}

class UserRoom extends React.Component<UserRoomProperties, UserRoomState> {
    mount: any;

    constructor(props) {
        super(props)

        this.state = {
            renderer: null
        }
    }

    async componentDidMount() {
        let roomAsRequest = await fetch(`${serverUrl}/auth/room/${this.props.userId}`)
        let roomAsJSON = await roomAsRequest.json();
        let roomDesign = await roomAsJSON.room;
        
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

        roomDesign.forEach((m) => {
            console.log(m)
            const cube = renderer.addEntity(m.name);
            cube.addController(OrbitableController).cameraController = cameraController;
            let cubeModelController = cube.addController(ModelController);
            if (m.material) {
                cubeModelController.load(m.path, m.material)
            }
            cube.transform.position.z = m.position.z;
            cube.transform.position.x = m.position.x;
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

        this.setState({renderer})
    }

    render() {
        return (
            <div className="user-room page">
                <div ref={el => this.mount = el}></div>
            </div>
        )
    }
}


export default withUserContext(UserRoom)