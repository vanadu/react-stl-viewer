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
// const height = 500;
// const width = height * 1.77;


// !VA Branch: 022221
// !VA Trying to get rid of the style on the parent div
// const style = {
//   height: height, // we can control scene size by setting container dimensions
//   width: width 
// };


// !VA Convert degrees to radians
// const deg2rad = (deg) => deg * (Math.PI/180);
let bbox;
let scene;
let canvas;

let foo;


class Scene extends Component {
  


  // !VA Originally in the Container component, pertains to the Unmount button
  // state = {isMounted: true, scene: null, camera: null, controls: null, model: 'init', stl: null };
  state = {isMounted: true };

  
  
  componentDidMount() {
    // this.addSTLObject();
    // !VA Get the scene and controls from sceneSetup and destructure
    this.sceneSetup();


    // !VA The commented lines below were required for the separate Model component
    // const [ scene, camera, controls ] = this.sceneSetup();
    // this.setState({scene: scene, camera: camera, controls: controls, model: this.props.model });
    // this.setState({scene: scene, camera: camera, controls: controls });
    // this.addSTLObject(this.scene);
    // console.log('this.scene :>> ');
    // console.log(this.scene);

    // console.log('this.camera :>> ');
    // console.log(this.camera);
    // console.log('this.controls :>> ');
    // console.log(this.controls);
    this.addCustomSceneObjects(this.scene);

    this.showStatus();
    this.startAnimationLoop(this.scene, this.camera);
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
    // !VA Branch: 022221
    // !VA Overriding...
    // const width = this.mount.clientWidth;
    // const height = this.mount.clientHeight;

    this.scene = new THREE.Scene();
    const fov = 45;
    // const aspect = width/height;
    const aspect = 1.5;
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
    // !VA Branch: 02222
    // !VA Overriding...
    // this.renderer.setSize( width, height );
    this.mount.appendChild( this.renderer.domElement ); // mount using React ref
    // !VA Set the child of the mounted 
    canvas = this.mount.children[0];
    // !VA Add the class canv1 to the child the this.mount element.
    canvas.classList.add('ui');
    canvas.classList.add('canv1');
    return [this.scene, this.camera, this.controls];
  };


  addSTLObject = (scene) => {
    console.log('scene :>> ');
    console.log(scene);
    const loader = new STLLoader();
    const promise = loader.loadAsync(this.props.model);
    console.log('promise :>> ');
    console.log(promise);
    promise.then( ( geometry ) => 
    {

      const stlmaterial = new THREE.MeshPhongMaterial( { color: 0x007fff, specular: 0x111111, shininess: 100, fog: false } );
      const stl = new THREE.Mesh( geometry, stlmaterial );

      stl.name = 'STL';
      console.log('stl.name :>> ' + stl.name);
      // !VA Center the stl geometry in the scene. Required.
      geometry.center();
      // !VA Get the STL model's bounding box. Required for positioning it in 3D space. 
      stl.geometry.computeBoundingBox();
      // !VA Get the STL model's boundingSphere. Required for sizing the Sphere object used for calculating the initial camera position. 
      stl.geometry.computeBoundingSphere();
      // !VA get the bounding box of the stl mesh
      let stlbox = stl.geometry.boundingBox;
      // !VA Set the initial position of the stl mesh to set its Y position to half its height. This sets its lowest point on the grid plane.
      stl.position.set( 0, stlbox.max.y, 0 );

      // // !VA This is where we used to set the camera position. That has been replaced by the zoomExtents function, but I'm leaving the original code commented here for posterity.
      // camera.position.set(stlbox.max.x * 3, stlbox.max.y * 3, stlbox.max.z * 10); 
      // controls.target = new THREE.Vector3(0, stlbox.max.y, 0);
      // controls.update();
      // !VA Put a shadow on the STL model
      stl.castShadow = true;
      stl.receiveShadow = true;
      // !VA If the Model component doesn't get the scene from the Scene component, the rest will fail silently, so add the error condition. This should be a try/catch. 
      if (scene) {
        scene.add(stl);
      } else {
        console.log('Scene does not exist');
      }

      // !VA Add a bounding sphere around the STL model to use with zoomExtents. The sphere and its material (otherwise it appears with the default opaque material) are required, but set the opacity to 0 to hide it.

      var geometry2 = new THREE.SphereGeometry(stl.geometry.boundingSphere.radius, 32, 32);
      var spherematerial = new THREE.MeshBasicMaterial({
        color: 0xffff00
      });
      spherematerial.transparent = true;
      spherematerial.opacity = 0;
      spherematerial.opacity = 0.35;
      var sphere = new THREE.Mesh(geometry2, spherematerial);
      sphere.name = 'Sphere';
      // !VA Set the sphere, as with the STL mesh, half the height of the STL mesh vertically off the grid
      sphere.position.y = stlbox.max.y;
      scene.add(sphere);



      // !VA Run zoomExtents to position the camera based on the STL model's bounding sphere
      zoomExtents(this.camera, sphere, this.controls, stlbox );




    }).catch(err => { console.log(' STL file not loaded!');});
    
    // function failureCallback(){
    //   console.log('Could not load STL file!');
    // }

    
    function zoomExtents( camera, sphere, controls, stlbox ) {
      console.log('zoomExtents running');

      // !VA These are the calcs provided by Alex Khoroshylov
      let vFoV = camera.getEffectiveFOV();
      let hFoV = camera.fov * camera.aspect;
      let FoV = Math.min(vFoV, hFoV);
      let FoV2 = FoV / 2;
      let dir = new THREE.Vector3();
      camera.getWorldDirection(dir);
      let cameraDir = new THREE.Vector3();
      camera.getWorldDirection(cameraDir);
      sphere.geometry.computeBoundingSphere();
      let bs = sphere.geometry.boundingSphere;
      let bsWorld = bs.center.clone();
      
      sphere.localToWorld(bsWorld);
      
      let th = FoV2 * Math.PI / 180.0;
      let sina = Math.sin(th);
      let R = bs.radius;
      let FL = R / sina;
      
      let cameraOffs = cameraDir.clone();
      cameraOffs.multiplyScalar(-FL);
      
      // !VA Add the height of the STL mesh to the camera's Z offset to draw the camera back a tad.
      cameraOffs.z = cameraOffs.z + stlbox.max.y;
      // !VA Set the camera position to the offset position above.
      let newCameraPos = bsWorld.clone().add(cameraOffs);
      // !VA Set the camera position
      camera.position.copy(newCameraPos);
      // !VA Move the world coordinates of the boundingSphere up accordingly. These will be the coordinates passed to lookAt to make sure the initial camera view angle matches the orbit target.
      bsWorld.y = stlbox.max.y;
      // !VA Set the camera lookAt to the boundingSphere world coordinates above
      camera.lookAt(bsWorld);
      // !VA Copy the lookAt coordinates above to the Orbit controls target so both the camera and the orbit controls are looking at the same point. 
      controls.target.copy(bsWorld);
      controls.update();

    }
    //  return baz;
    // this.showStatus();
  }





  // Here should come custom code.
  // Code below is taken from Three.js BoxGeometry example
  // https://threejs.org/docs/#api/en/geometries/BoxGeometry
  addCustomSceneObjects = (scene ) => {
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

    scene.add( lights[ 0 ] );
    scene.add( lights[ 1 ] );
    scene.add( lights[ 2 ] );
    // !VA 
    const light = new THREE.AmbientLight( 0x404040 ); // soft white light
    scene.add( light );
    // !VA Added scene background
    scene.background = new THREE.Color('grey');
    {
      const gridHelper = new THREE.GridHelper( 1000, 40, 0xfeffce, 0xFFFFFF );
      gridHelper.position.y = 0;
      gridHelper.position.x = 0;
      scene.add( gridHelper );
    }

    {
      const color = 'grey';  // white
      const near = 10;
      const far = 500;
      scene.fog = new THREE.Fog(color, near, far);
    }
  };


  showStatus = async () => {
    const result = await this.addSTLObject(this.scene);
    console.log('showStatus running');
    console.log('result :>> ');
    console.log(result);
      console.log('this.scene :>> ');
      console.log(this.scene);
      foo = this.scene.children.map( item  => item.type);
      console.log('foo :>> ');
      console.dir(foo);
    
  }

  // showStatus = () => {
  //   console.log('Showing status of objects:');
  //   console.log('this.scene :>> ');
  //   console.log(this.scene);
  //   foo = this.scene.children.map( item  => item.type);
  //   console.log('foo :>> ');
  //   console.dir(foo);
  // }

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
      // console.log('width :>> ');
      // console.log(width);
      // console.log('height :>> ');
      // console.log(height);

      this.renderer.setSize( width, height );
      this.camera.aspect = width / height;

      // Note that after making changes to most of camera properties you have to call
      // .updateProjectionMatrix for the changes to take effect.
      this.camera.updateProjectionMatrix();
  };


  
  render() {
      // !VA  This is NOT the way it's supposed to be done, I'm sure. 
      // if(this.mount) {
      //   let foo = this.mount.children[0];
      //   foo.classList.add('canv1');
      // }
      
      return (
        <>
          {/* <Model scene={this.state.scene} camera={this.state.camera} controls={this.state.controls} model={this.state.model} /> */}
          <div className="model"
            // !VA Branch: 022221 
            // style={style} 
            ref={ref => (this.mount = ref)}
            >
          </div>
        </>
      );
  }
}



export default Scene;

