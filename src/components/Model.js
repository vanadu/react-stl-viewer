import React, { Component } from "react";
import Model1 from '../assets/model1.stl';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import Scene from './Scene';



const Model = (props) => {
  
  console.log('TOP OF MODEL props :>> ');
  console.log(props);
  let bbox;
  const scene = props.scene;
  console.log('HERE scene :>> ');
  console.log(scene);

  function addSTLObject()  {
    // console.log('this.props.message Mark3 :>> ');
    // console.log(this.props.message);
    const loader = new STLLoader();
    const promise = loader.loadAsync(Model1);
    promise.then( ( geometry ) => {
      // console.log('geometry :>> ');
      // console.log(geometry);
      const material = new THREE.MeshPhongMaterial( { color: 0x007fff, specular: 0x111111, shininess: 100, fog: false } );
      const mesh = new THREE.Mesh( geometry, material );
      // !VA Cener the mesh geometry in the scene.
      geometry.center();
      mesh.geometry.computeBoundingBox();
      let bbox = mesh.geometry.boundingBox;
      // console.log('bbox :>> ');
      // console.log(bbox);
      mesh.position.set( 0, bbox.max.y, 0 );
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