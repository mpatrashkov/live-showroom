import React from 'react';
import logo from './logo.svg';
import './App.css';

import * as three from "three";
import Renderer from './renderer/Renderer';
import CubeController from './renderer/CubeController';
import CameraController from './renderer/CameraController';
import FloorController from './renderer/FloorController';

class App extends React.Component {
  mount: any;

  componentDidMount() {
    const renderer = new Renderer(this.mount);
    renderer.start();
    
    const cube = renderer.addEntity("cube");
    cube.addController(CubeController);

    const cube2 = renderer.addEntity("cube2");
    cube2.addController(FloorController);
    cube2.transform.position.x = 3;

    const master = renderer.addEntity("master");
    master.addController(CameraController);
  }

  render() {
    return (
      <div ref={el => this.mount = el}></div>
    )
  }
}

export default App;
