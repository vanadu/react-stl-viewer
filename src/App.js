import React, { Component } from "react";
import Model1 from './model1.stl';
import * as THREE from 'three';
import { GridHelper } from 'three/src/helpers/GridHelper.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

const style = {
  height: 500 // we can control scene size by setting container dimensions
};

console.log('Model1 :>> ');
console.log(Model1);



class App extends Component {
  componentDidMount() {
      this.sceneSetup();
      this.addCustomSceneObjects();
      this.addSTLObject();
      this.startAnimationLoop();
      window.addEventListener('resize', this.handleWindowResize);
  }

  componentWillUnmount() {
      window.removeEventListener('resize', this.handleWindowResize);
      window.cancelAnimationFrame(this.requestID);
      this.controls.dispose();
  }

  // Standard scene setup in Three.js. Check "Creating a scene" manual for more information
  // https://threejs.org/docs/#manual/en/introduction/Creating-a-scene
  sceneSetup = () => {
      // get container dimensions and use them for scene sizing
      const width = this.mount.clientWidth;
      const height = this.mount.clientHeight;

      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(
          75, // fov = field of view
          width / height, // aspect ratio
          0.1, // near plane
          1000 // far plane
      );
      this.camera.position.z = 9; // is used here to set some distance from a cube that is located at z = 0
      // OrbitControls allow a camera to orbit around the object
      // https://threejs.org/docs/#examples/controls/OrbitControls
      this.controls = new OrbitControls( this.camera, this.mount );
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize( width, height );
      this.mount.appendChild( this.renderer.domElement ); // mount using React ref
  };

  addSTLObject = () => {
    console.log('here');
    const loader = new STLLoader();
    loader.load(
      Model1, ( geometry) => {
        const material = new THREE.MeshPhongMaterial( { color: 0x007fff, specular: 0x111111, shininess: 100, fog: false } );
        const mesh = new THREE.Mesh( geometry, material );
        console.log('mesh :>> ');
        console.log(mesh);
        this.scene.add(mesh);
      }

    )
  }

  
  // Here should come custom code.
  // Code below is taken from Three.js BoxGeometry example
  // https://threejs.org/docs/#api/en/geometries/BoxGeometry
  addCustomSceneObjects = () => {
      const geometry = new THREE.BoxGeometry(2, 2, 2);
      const material = new THREE.MeshPhongMaterial( {
          color: 0x156289,
          emissive: 0x072534,
          side: THREE.DoubleSide,
          flatShading: true
      } );
      this.cube = new THREE.Mesh( geometry, material );
      // console.log('this.cube :>> ');
      // console.log(this.cube);
      this.scene.add( this.cube );

      const lights = [];
      lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
      lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
      lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );

      lights[ 0 ].position.set( 0, 200, 0 );
      lights[ 1 ].position.set( 100, 200, 100 );
      lights[ 2 ].position.set( - 100, - 200, - 100 );

      this.scene.add( lights[ 0 ] );
      this.scene.add( lights[ 1 ] );
      this.scene.add( lights[ 2 ] );
      // !VA 
      const light = new THREE.AmbientLight( 0x404040 ); // soft white light
      this.scene.add( light );
      // !VA 
      this.scene.background = new THREE.Color('grey');
      {
        const gridHelper = new THREE.GridHelper( 1000, 40, 0xfeffce, 0xFFFFFF );
        gridHelper.position.y = 0;
        gridHelper.position.x = 0;
        this.scene.add( gridHelper );
      }


  };

  startAnimationLoop = () => {
      this.cube.rotation.x += 0.01;
      this.cube.rotation.y += 0.01;

      this.renderer.render( this.scene, this.camera );

      // The window.requestAnimationFrame() method tells the browser that you wish to perform
      // an animation and requests that the browser call a specified function
      // to update an animation before the next repaint
      this.requestID = window.requestAnimationFrame(this.startAnimationLoop);
  };

  handleWindowResize = () => {
      const width = this.mount.clientWidth;
      const height = this.mount.clientHeight;

      this.renderer.setSize( width, height );
      this.camera.aspect = width / height;

      // Note that after making changes to most of camera properties you have to call
      // .updateProjectionMatrix for the changes to take effect.
      this.camera.updateProjectionMatrix();
  };

  render() {
      return (
      <div style={style} ref={ref => (this.mount = ref)}>
          <div>
            App content
          </div>
          {/* <Container /> */}

      </div>

      );
  }
}

class Container extends React.Component {
  state = {isMounted: true};

  render() {
      const {isMounted = true} = this.state;
      return (
          <>
              <button onClick={() => this.setState(state => ({isMounted: !state.isMounted}))}>
                  {isMounted ? "Unmount" : "Mount"}
              </button>
              {isMounted && <App />}
              {isMounted && <div>Scroll to zoom, drag to rotate</div>}
          </>
      )
  }
}

// const rootElement = document.getElementById("root");
// ReactDOM.render(<Container />, rootElement);

export default App;

