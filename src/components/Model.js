import React, { Component } from "react";
import Model1 from '../assets/model1.stl';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import Scene from './Scene';



const Model = (props) => {
  console.log('props.model :>> ');
  console.log(props.model);


  console.log('TOP OF MODEL props :>> ');
  console.log(props);
  let bbox;
  const scene = props.scene;
  const controls = props.controls;
  const camera = props.camera;
  const model = props.model;

  function addSTLObject()  {
    // console.log('this.props.message Mark3 :>> ');
    // console.log(this.props.message);
    const loader = new STLLoader();
    const promise = loader.loadAsync(model);
    promise.then( ( geometry ) => {
      // console.log('geometry :>> ');
      // console.log(geometry);
      const material = new THREE.MeshPhongMaterial( { color: 0x007fff, specular: 0x111111, shininess: 100, fog: false } );
      const mesh = new THREE.Mesh( geometry, material );
      // !VA Cener the mesh geometry in the scene.
      geometry.center();
      mesh.geometry.computeBoundingBox();
      let bbox = mesh.geometry.boundingBox;
      console.log('bbox :>> ');
      console.log(bbox);
      mesh.position.set( 0, bbox.max.y, 0 );

      // // !VA Set the camera.position and controls.target relative to the bounding box values. For now, the camera position is set to be 3X as far away as the dimension of the bounding box except for the z axis, which is 10 times away, since the max-z is now only 12.5 since I rotated the native model orientation. We need a better formula for that. controls.target points the camera at the 3D position, in this case, halfway up the height of the STL model.
      camera.position.set(bbox.max.x * 3, bbox.max.y * 3, bbox.max.z * 10); 
      controls.target = new THREE.Vector3(0, bbox.max.y, 0);
      controls.update();
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      // !VA Since this function runs twice - the first time scene is null, the second time it gets the value from the Scene component and renders. Not sure why
      scene.add(mesh);
    }).catch(failureCallback);
    
    function failureCallback(){
      console.log('Could not load STL file!');
    }
  }


  addSTLObject();



  return (
    <div>

    </div>
  );

};

export default Model;