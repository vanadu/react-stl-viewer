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
const height = 480;
const width = 720;


// !VA Branch: 022221
// !VA Trying to get rid of the style on the parent div
// !VA Branch: 022421
// !VA Was hoping this would fix the blockiness, but it didn't. Style is set in the CSS, so adding style here does nothing.
// const style = {
//   height: height, // we can control scene size by setting container dimensions
//   width: width 
// };


// !VA Convert degrees to radians
// const deg2rad = (deg) => deg * (Math.PI/180);
let canvas;


class Scene extends Component {



  // !VA Originally in the Container component, pertains to the Unmount button
  // state = {isMounted: true, scene: null, camera: null, controls: null, model: 'init', stl: null };
  state = {isMounted: true, isLoaded: false };
  
  componentDidMount() {
    

    // !VA Initialize scene and add stl geometry which is called at the tail with intializeSTL
    this.initializeScene();

    console.log('this.state.isLoaded :>> ');
    console.log(this.state.isLoaded);

      
      // this.sceneSetup(this.scene);

      // this.addCustomSceneObjects();

      // this.startAnimationLoop();
      // window.addEventListener('resize', this.handleWindowResize);



    // }, 300);
  }

  // !VA WORKS!!!
  componentDidUpdate() {



    console.log('this.state.isLoaded :>> ');
    console.log(this.state.isLoaded);


    this.sceneSetup(this.scene);

    this.addCustomSceneObjects();

    this.startAnimationLoop();
    window.addEventListener('resize', this.handleWindowResize);
  



  }

  componentWillUnmount() {
      window.removeEventListener('resize', this.handleWindowResize);
      window.cancelAnimationFrame(this.requestID);
      this.controls.dispose();
  }


  // !VA Load the STL geometry, initialize the scene and add the STL with no opacity
    initializeSTL = (scene) => {
  
    const loader = new STLLoader();
    const promise = loader.loadAsync(this.props.model);
    promise.then( ( geometry ) => 
    {
      console.log('promise :>> ');
      console.log(promise);
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
      scene.add(stl);

      this.setState({ isLoaded: true})
      console.log('this.state :>> ');
      console.log(this.state);
      console.log('stl :>> ');
      console.log(stl);
      
    }).catch(err => { console.log(' STL file not loaded!');});





  }
  
  initializeScene = () => {
    this.scene = new THREE.Scene();
    this.initializeSTL(this.scene)
  };





  // Standard scene setup in Three.js. Check "Creating a scene" manual for more information
  // https://threejs.org/docs/#manual/en/introduction/Creating-a-scene
  sceneSetup = () => {
      console.log('sceneSetup running');
      const stl = this.scene.children[0];
      const stlbox = stl.geometry.boundingBox;

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
      this.scene.add(sphere);


       

      // !VA Overriding, container set in CSS
      // const width = this.mount.clientWidth;
      // const height = this.mount.clientHeight;

      // this.scene = new THREE.Scene();
      const fov = 45;
      // const aspect = width/height;
      const aspect = 1.5;
      const near = 0.1;
      const far = 1000;
      this.camera = new THREE.PerspectiveCamera( fov, aspect, near, far);
      this.camera.position.set(10 * 3, 10 * 3, 10 * 10); 
      this.controls = new OrbitControls( this.camera, this.mount);
      this.controls.target = new THREE.Vector3(0, 0, 0);
      this.controls.update();



      zoomExtents( this.camera, sphere, this.controls, stlbox);

      // this.controls.target = ( 0, 44, 0);
      this.renderer = new THREE.WebGLRenderer();
      // !VA Branch: 02222
      // !VA Overriding...
      // !VA setSize is initialized here and called again whenever the window size changes in handleWindowResize


      // !VA controls.update() appears to set the camera position to the controls.target

      this.renderer.setSize( width, height );
      this.mount.appendChild( this.renderer.domElement ); // mount using React ref
      // !VA this.mount draws the canvas, so set variable to refer to it as such
      canvas = this.mount.children[0];

      

      // !VA Add the class canv1 to the child the this.mount element.
      canvas.classList.add('ui');
      canvas.classList.add('canv1');


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
        let stlsphere = sphere.geometry.boundingSphere;
        let bsWorld = stlsphere.center.clone();
        
        sphere.localToWorld(bsWorld);
        
        let th = FoV2 * Math.PI / 180.0;
        let sina = Math.sin(th);
        let R = stlsphere.radius;
        let FL = R / sina;
        
        let cameraOffs = cameraDir.clone();

        // !VA ????????
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
        console.log('zoomExtents complete');
      }







      return [this.scene, this.camera, this.controls];
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
    
      // !VA autoRotate and damping speed and factor
      this.controls.autoRotate = true;
      this.controls.autoRotateSpeed = 1;
      this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
      this.controls.dampingFactor = 0.1;
      this.controls.update();
      // !VA Render
      this.renderer.render( this.scene, this.camera );
      // !VA window.requestAnimationFrame() method tells the browser that you wish to perform an animation and requests that the browser call a specified function to update an animation before the next repaint
      this.requestID = window.requestAnimationFrame(this.startAnimationLoop);
  };

  handleWindowResize = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      this.renderer.setSize( width, height );
      this.camera.aspect = width / height;

      // Note that after making changes to most of camera properties you have to call
      // .updateProjectionMatrix for the changes to take effect.
      this.camera.updateProjectionMatrix();
  };


  
  render() {
      return (
        <>
          <div className="test"
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

