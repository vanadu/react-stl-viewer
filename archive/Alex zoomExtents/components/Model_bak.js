import React, { Component } from "react";
import Model1 from '../assets/model1.stl';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import Scene from './Scene';
import { MeshBasicMaterial } from "three";



const Model = (props) => {

  // console.log('TOP OF MODEL props :>> ');
  // console.log(props);
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
      mesh.geometry.computeBoundingSphere();
      let bbox = mesh.geometry.boundingBox;
      mesh.position.set( 0, bbox.max.y, 0 );
      console.log('NOW mesh.position :>> ');
      console.log(mesh.position);


      // !VA Branch: 022121 from Alex's example
      // const camera = new THREE.PerspectiveCamera(54, window.innerWidth / window.innerHeight, 0.1, 1000);
      // camera.position.x = 15;
      // camera.position.y = 15;
      // camera.position.z = 15;
      // camera.lookAt(0, 0, 0);

      var geometry2 = new THREE.SphereGeometry(mesh.geometry.boundingSphere.radius, 32, 32);
      var material2 = new THREE.MeshBasicMaterial({
        color: 0xffff00
      });
      material2.transparent = true;
      material2.opacity = 0.35;
      var sphere = new THREE.Mesh(geometry2, material2);
      sphere.name = 'Sphere';
      sphere.position.y = bbox.max.y;
      scene.add(sphere);

      



      // // !VA Set the camera.position and controls.target relative to the bounding box values. For now, the camera position is set to be 3X as far away as the dimension of the bounding box except for the z axis, which is 10 times away, since the max-z is now only 12.5 since I rotated the native model orientation. We need a better formula for that. controls.target points the camera at the 3D position, in this case, halfway up the height of the STL model.


      // !VA Branch: 022121
      // camera.position.set(bbox.max.x * 3, bbox.max.y * 3, bbox.max.z * 10); 
      // controls.target = new THREE.Vector3(0, bbox.max.y, 0);
      // controls.update();
      // !VA Branch: 022121
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      // !VA Since this function runs twice - the first time scene is null, the second time it gets the value from the Scene component and renders. Not sure why
      scene.add(mesh);


      // zoomExtents( camera, MeshBasicMaterial, controls);

      console.log('FINAL camera.position :>> ');
      console.log(camera.position);

    }).catch(failureCallback);
    
    function failureCallback(){
      console.log('Could not load STL file!');
    }
  }


  addSTLObject();

  function zoomExtents(camera, object1, controls) {
    console.log('zoomExtents running');
    console.log('object1 :>> ');
    console.log(object1);

    let vFoV = camera.getEffectiveFOV();
    let hFoV = camera.fov * camera.aspect;
  
    let FoV = Math.min(vFoV, hFoV);
    // !VA 
    let FoV2 = FoV / 2;
    // let FoV2 = FoV;

    let dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    let bb = object1.geometry.boundingBox;
    object1.geometry.computeBoundingSphere();
    let bs = object1.geometry.boundingSphere;
    let bsWorld = bs.center.clone();
    object1.localToWorld(bsWorld);
  
    let th = FoV2 * Math.PI / 180.0;
    let sina = Math.sin(th);
    let R = bs.radius;
    let FL = R / sina;
  
    let cameraDir = new THREE.Vector3();
    camera.getWorldDirection(cameraDir);
  
    let cameraOffs = cameraDir.clone();
    cameraOffs.multiplyScalar(-FL);
    console.log('cameraOffs :>> ');
    console.log(cameraOffs);
    // !VA 
    cameraOffs.x = cameraOffs.x + 1000; 
    cameraOffs.y = cameraOffs.y + 1000; 
    cameraOffs.z = cameraOffs.z + 1000; 

    console.log('NEW cameraOffs :>> ');
    console.log(cameraOffs);
    let newCameraPos = bsWorld.clone().add(cameraOffs);
  
    camera.position.copy(newCameraPos);
    console.log('NOW camera.position :>> ');
    console.log(camera.position);
    camera.lookAt(bsWorld);
    console.log('NOW camera.position :>> ');
    console.log(camera.position);
    controls.target.copy(bsWorld);
    controls.target.y = controls.target.y + bbox.max.y;
    console.log('controls.target :>> ');
    console.log(controls.target);
  
    controls.update();
    console.log('camera.position :>> ');
    console.log(camera.position);
    console.log('zoomExtents FINISHED');
  }




  return (
    <div>

    </div>
  );

};

export default Model;