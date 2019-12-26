// import * as THREE from "../../../node_modules/three/build/three";
// importScripts("../../../node_modules/three/build/three")
// var THREE = require('three');
import * as THREE  from "three";
import { Object3D } from "three";

export default (msg) => {
	self.addEventListener('message', e => { // eslint-disable-line no-restricted-globals
		if (!e) return;
        console .log("MESSAGE ===>>", e.data.data)

        const data = e.data.data;

// function _convertLatLonToVec3(lat, lon) {
//     lat = lat * Math.PI / 180.0;
//     lon = -lon * Math.PI / 180.0;
//     return new THREE.Vector3(
//       Math.cos(lat) * Math.cos(lon),
//       Math.sin(lat),
//       Math.cos(lat) * Math.sin(lon));
//   }

  /////
  
  // function InfoBox(city, radius, domElement) {
  //   this._screenVector = new THREE.Vector3(0, 0, 0);
  
  //   this.position = _convertLatLonToVec3(city.lat, city.lng).multiplyScalar(radius);
  
  //   // create html overlay box
  //   this.box = document.createElement('div');
  //   this.box.innerHTML = city.name;
  //   this.box.className = "hudLabel";
  
  //   this.domElement = domElement;
  //   this.domElement.appendChild(this.box);
  
  // }

  ////
  
  // InfoBox.prototype.update = function () {
  //   this._screenVector.copy(this.position);
  //   this._screenVector.project(this.camera);
  
  //   var posx = Math.round((this._screenVector.x + 1) * this.domElement.offsetWidth / 2);
  //   var posy = Math.round((1 - this._screenVector.y) * this.domElement.offsetHeight / 2);
  
  //   var boundingRect = this.box.getBoundingClientRect();
  
  //   // update the box overlays position
  //   this.box.style.left = (posx - boundingRect.width) + 'px';
  //   this.box.style.top = posy + 'px';
  // };
  
  //--------------------------------
  
  
  function Marker(lat,lng, index) {
    Object3D.call(this);
  
    var radius = 0.002;
    var circleRadius = 0.003
    var height =  Math.random() * 0.8 ;
  
    // var material = new THREE.MeshPhongMaterial({
    //   color: "#E36009"
    // });
  
    if( index % 2 == 0 ) {
  
      var materialYellowLines = new THREE.LineBasicMaterial( {
        color: "#F7F707",
        linewidth: 1,
        linecap: 'round', //ignored by WebGLRenderer
        linejoin:  'round' //ignored by WebGLRenderer,
    
      } );
    
      var cone = new THREE.Mesh(new THREE.CylinderBufferGeometry(radius, circleRadius, 0.1, 30 ), materialYellowLines);
      cone.position.y = -0.05//height * 0.5;
      cone.rotation.x = Math.PI;
      cone.userData = {index: index, lat: lat, lng: lng}
      
  
    } else {
      
    
  
      var materialRedLines = new THREE.LineBasicMaterial( {
        color: "#E80606",
        linewidth: 1,
        linecap: 'round', //ignored by WebGLRenderer
        linejoin:  'round' //ignored by WebGLRenderer,
    
      } );
      var cone = new THREE.Mesh(new THREE.CylinderBufferGeometry(radius, radius, height, 30 ), materialRedLines);
      cone.position.y =  height * 0.5;
      cone.rotation.x = Math.PI;
      cone.userData = {index: index, lat: lat, lng: lng}
    }
    
    this.add(cone);
  }
  
  Marker.prototype = Object.create(Object3D.prototype);
  
  // ------ Earth object -------------------------------------------------
  
  function Earth(radius, texture, texture2) {
    Object3D.call(this);
  
    this.userData.radius = radius;
  
    var earth = new THREE.Mesh(
      new THREE.SphereBufferGeometry(radius, 64.0, 48.0),
      new THREE.MeshPhongMaterial({
        map: texture,
        color: "#66a3ff",
        bumpMap: texture2,
        bumpScale: 0.2,
        
      })
    );
  
    this.add(earth);
  }
  var markerarry = [];
  Earth.prototype = Object.create(Object3D.prototype);
  
  Earth.prototype.createMarker = function (lat, lon, index) {
    var marker = new Marker(lat,lon,index);
  
    var latRad = lat * (Math.PI / 180);
    var lonRad = -lon * (Math.PI / 180);
    var r = this.userData.radius;
  
    marker.position.set(Math.cos(latRad) * Math.cos(lonRad) * r, Math.sin(latRad) * r, Math.cos(latRad) * Math.sin(lonRad) * r);
    marker.rotation.set(0.0, -lonRad, latRad - Math.PI * 0.5);
  
    this.add(marker);
  };
  



        var earth = new Earth(1.0, e.data.texture2, e.data.texture);

        data.forEach( (element, index) => {
          console.log("ele,emt ", element)    
          // earth.createMarker(element.lat, element.lng, index); // Paris  
            });
		postMessage("hi");
	})
}
