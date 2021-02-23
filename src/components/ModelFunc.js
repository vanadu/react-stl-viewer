import React, { Component } from "react";
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
// import Model1 from '../assets/model1.stl';
// import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
// import Scene from './Scene';


// !VA This uses the React rendering example at https://codesandbox.io/s/github/supromikali/react-three-demo?file=/src/index.js:0-4455 to get the STL rendered, with mods I made to replace the basic Box in the example with the STL. For the camera positioning, I used Alex Khoroshylov's example here https://stackoverflow.com/questions/14614252/how-to-fit-camera-to-object/14614736#14614736 and the working demo here https://jsfiddle.net/mmalex/h7wzvbkt/ to set the initial camera position based on the boundingSphere of the model and the height of the STL mesh. NOTE: All of the provided code is required for it to work as expected, I removed all the extraneous lines.
const Model = (props) => {

  

  // !VA Get the THREE scene objects which are set to state in the Scene component
  const scene = props.scene;
  const controls = props.controls;
  const camera = props.camera;
  const model = props.model;

  
  // !VA The render method in the Scene component runs twice (once at state initialization and once in componentDidMount ). The first time, this.state.model is an empty string because that is the initialization pass. So only run addSTLObject on the second run, i.e. if props.model is not an empty string.
  if (props.model !== '') { addSTLObject();};

  function onModelLoad() {
    console.log(`STL model ${model} loaded.`);
    // props.loadedModel(model);
  }

  // !VA The STL object loads, but still outputs the error message, I haven't figured out why. There is probably something wrong with the function structure so that the catch is called as a parameter, not as a callback. Need to look into that soon.
  function addSTLObject()  {
    const loader = new STLLoader();
    const promise = loader.loadAsync(model);
    console.log('promise :>> ');
    console.log(promise);
    promise.then( ( geometry ) => 
    {

      onModelLoad(model);
      console.log('geometry :>> ');
      console.log(geometry);

      const stlmaterial = new THREE.MeshPhongMaterial( { color: 0x007fff, specular: 0x111111, shininess: 100, fog: false } );
      const stl = new THREE.Mesh( geometry, stlmaterial );


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
      // spherematerial.opacity = 0.35;
      spherematerial.opacity = 0;
      var sphere = new THREE.Mesh(geometry2, spherematerial);
      sphere.name = 'Sphere';
      // !VA Set the sphere, as with the STL mesh, half the height of the STL mesh vertically off the grid
      sphere.position.y = stlbox.max.y;
      scene.add(sphere);
      // !VA Run zoomExtents to position the camera based on the STL model's bounding sphere
      zoomExtents(camera, sphere, controls, stlbox);

    }).catch(err => { 
      
      console.log('STL file could not be loaded');
    
    });
    
    // function failureCallback(){
    //   console.log('Could not load STL file!');
    // }
  }




  function zoomExtents(camera, sphere, controls, stlbox) {
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
    // !VA Update the orbit and camera controls.
    controls.target.update();
    camera.position.update();
  }

  return (
    // !VA NOTE: The Model component doesn't output any JSX. What is its function actually? For now, I'm going to leave it there and just output an empty Fragment, but it might be better just to include it in another component.  
    <>
    </>
  );

};

export default Model;