import React, { Component } from "react";
// import Model from '../assets/model1.stl';
import * as THREE from 'three';
// !VA GridHelper is now in Three core, I guess, since the import is not accessed.
// import { GridHelper } from 'three/src/helpers/GridHelper.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import Model from './Model';

// !VA Using this example: https://codesandbox.io/s/github/supromikali/react-three-demo?file=/src/index.js:0-4455

// !VA Set the width/height to 16:9
const height = 500;
const width = height * 1.77;

const style = {
  height: height, // we can control scene size by setting container dimensions
  width: width 
};


// !VA Convert degrees to radians
// const deg2rad = (deg) => deg * (Math.PI/180);
let bbox;
let scene;


class Scene extends Component {
  // constructor(props) {
  //   super(props);

  // }
  

  // !VA Originally in the Container component, pertains to the Unmount button
  state = {isMounted: true, scene: null};

  componentDidMount() {

      // this.addSTLObject();
      const scene = this.sceneSetup();
      this.scene = scene;
      this.setState({scene: this.scene})
      this.addCustomSceneObjects();
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
      const fov = 45;
      const aspect = width/height;
      const near = 0.1;
      const far = 1000;
      this.camera = new THREE.PerspectiveCamera( fov, aspect, near, far);
      this.controls = new OrbitControls( this.camera, this.mount);
      // !VA Branch: 022121 Initializing here for now, these controls should be in the Model component
      // !VA Set the camera.position and controls.target relative to the bounding box values. For now, the camera position is set to be 3X as far away as the dimension of the bounding box except for the z axis, which is 10 times away, since the max-z is now only 12.5 since I rotated the native model orientation. We need a better formula for that. controls.target points the camera at the 3D position, in this case, halfway up the height of the STL model.
      this.camera.position.set(10 * 3, 10 * 3, 10 * 10); 
      this.controls.target = new THREE.Vector3(0, 0, 0);
      // !VA controls.update() appears to set the camera position to the controls.target
      this.controls.update();
      // this.controls.target = ( 0, 44, 0);
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize( width, height );
      this.mount.appendChild( this.renderer.domElement ); // mount using React ref
      return this.scene;
  };

  // Here should come custom code.
  // Code below is taken from Three.js BoxGeometry example
  // https://threejs.org/docs/#api/en/geometries/BoxGeometry
  addCustomSceneObjects = () => {
    // const geometry = new THREE.BoxGeometry(2, 2, 2);
    // const material = new THREE.MeshPhongMaterial( {
    //     color: 0x156289,
    //     emissive: 0x072534,
    //     side: THREE.DoubleSide,
    //     flatShading: true
    // } );
    // this.cube = new THREE.Mesh( geometry, material );
    // this.scene.add( this.cube );

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
    // !VA Added scene background
    this.scene.background = new THREE.Color('grey');
    {
      const gridHelper = new THREE.GridHelper( 1000, 40, 0xfeffce, 0xFFFFFF );
      gridHelper.position.y = 0;
      gridHelper.position.x = 0;
      this.scene.add( gridHelper );
    }

    {
      const color = 'grey';  // white
      const near = 10;
      const far = 500;
      this.scene.fog = new THREE.Fog(color, near, far);
    }
  };

  startAnimationLoop = () => {
      // !VA Pertains to the deleted cube 
      // this.cube.rotation.x += 0.01;
      // this.cube.rotation.y += 0.01;

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

        <div>
          <Model scene={this.state.scene}/>
          <div 
            style={style} 
            ref={ref => (this.mount = ref)}
            >
          </div>
        </div>
      );
  }
}



export default Scene;

