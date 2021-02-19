import React, { Component } from "react";
import model1 from './model1.stl';
import * as THREE from 'three';
// !VA GridHelper is now in Three core, I guess, since the import is not accessed.
// import { GridHelper } from 'three/src/helpers/GridHelper.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

// !VA Set the width/height to 16:9
const height = 500;
const width = height * 1.77;

const style = {
  height: height, // we can control scene size by setting container dimensions
  width: width 
};


// !VA Convert degrees to radians
const deg2rad = (deg) => deg * (Math.PI/180);
let bbox;

class STLViewer extends Component {
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
      // !VA From source: https://codesandbox.io/s/github/supromikali/react-three-demo?file=/src/index.js:1096-1301
      //   this.camera = new THREE.PerspectiveCamera(
      //     75, // fov = field of view
      //     width / height, // aspect ratio
      //     0.1, // near plane
      //     1000 // far plane
      // );
      const fov = 45;
      // !VA This results in object elongation, I don't know why it does that here but not in the original non-React STL viewer.
      // const aspect = 2;  // the canvas default
      console.log('width :>> ');
      console.log(width);
      console.log('height :>> ');
      console.log(height);
      const aspect = width/height;
      const near = 0.1;
      // // !VA Changing 5 to 100. Nothing happens until you change camera.position
      // // const far = 5;
      // // const far = 100;
      const far = 1000;



      this.camera = new THREE.PerspectiveCamera(
          fov, // fov = field of view
          aspect, // aspect ratio
          near, // near plane
          far // far plane
      );
      // !VA Deleted below
      // this.camera.position.z = 9; // is used here to set some distance from a cube that is located at z = 0
      // OrbitControls allow a camera to orbit around the object
      // https://threejs.org/docs/#examples/controls/OrbitControls

      // !VA 
      this.camera.position.set(12.5 * 3, 12.5 * 3, 40 * 3);
      // this.camera.position.set(0, 0, 12.5 * 3);
      // this.camera.lookAt(new THREE.Vector3(0,22,0));
      // this.controls.update();

      this.controls = new OrbitControls( this.camera, this.mount);
      this.controls.target = new THREE.Vector3(0, 44, 0);
      // !VA controls.update() appears to set the camera position to the controls.target
      this.controls.update();


      // this.controls.target = ( 0, 44, 0);
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize( width, height );
      this.mount.appendChild( this.renderer.domElement ); // mount using React ref
  };

  addSTLObject = () => {


    // let bbox;

    const loader = new STLLoader();
    const promise = loader.loadAsync(model1);
    promise.then( ( geometry ) => {
      const material = new THREE.MeshPhongMaterial( { color: 0x007fff, specular: 0x111111, shininess: 100, fog: false } );
      const mesh = new THREE.Mesh( geometry, material );
      // !VA Cener the mesh geometry in the scene.
      geometry.center();
      mesh.geometry.computeBoundingBox();
      bbox = mesh.geometry.boundingBox;
      // console.log('bbox :>> ');
      // console.log(bbox);
      // console.log(`bbox.max.y :>> ${bbox.max.y};`)
      // !VA Takes rotation values in radians, so convert, see function at top of main closure
      // !VA Rotate model so it is standing upright.
      mesh.rotation.x = deg2rad(270);
      // mesh.rotation.x = 0;
      mesh.rotation.y = 0;
      mesh.rotation.z =0;
      // console.log('mesh.rotation :>> ');
      // console.log(mesh.rotation);
      // mesh.position.set( 0, - 0.25, 0.6 );
      mesh.position.set( 0, bbox.max.z, 0 );
      // !VA Rotation, the original is commented
      // mesh.rotation.set( 0, - Math.PI / 2, 0 );
      // mesh.rotation.set( 0, 0, 0 );
      // !VA Trying to manipulate, the original is commented
      // mesh.scale.set( 0.5, 0.5, 0.5 );
      // mesh.scale.set( 0.25, 0.25, 0.25 );
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.scene.add( mesh );
      console.log('STL file loaded!');
    }).catch(failureCallback);
    
    function failureCallback(){
      console.log('Could not load STL file!');
    }
    return bbox;
  }

  
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
      <div style={style} ref={ref => (this.mount = ref)}>
          <div>
            STL Viewer
          </div>
          <div>{/* <Container /> */}</div>

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
              {isMounted && <STLViewer />}
              {isMounted && <div>Scroll to zoom, drag to rotate</div>}
          </>
      )
  }
}

// const rootElement = document.getElementById("root");
// ReactDOM.render(<Container />, rootElement);

export default STLViewer;

