import React from "react";
import * as THREE from "three";
import imge from '../../Assets/earth-dark.jpg'
import imge2 from '../../Assets/earth-topology.png' //earth-topology
import randomCordinates from "random-coordinates";
var OrbitControls = require('three-orbit-controls')(THREE)

function _convertLatLonToVec3(lat, lon) {
  lat = lat * Math.PI / 180.0;
  lon = -lon * Math.PI / 180.0;
  return new THREE.Vector3(
    Math.cos(lat) * Math.cos(lon),
    Math.sin(lat),
    Math.cos(lat) * Math.sin(lon));
}

function InfoBox(city, radius, domElement) {
  this._screenVector = new THREE.Vector3(0, 0, 0);

  this.position = _convertLatLonToVec3(city.lat, city.lng).multiplyScalar(radius);

  // create html overlay box
  this.box = document.createElement('div');
  this.box.innerHTML = city.name;
  this.box.className = "hudLabel";

  this.domElement = domElement;
  this.domElement.appendChild(this.box);

}

InfoBox.prototype.update = function () {
  this._screenVector.copy(this.position);
  this._screenVector.project(this.camera);

  var posx = Math.round((this._screenVector.x + 1) * this.domElement.offsetWidth / 2);
  var posy = Math.round((1 - this._screenVector.y) * this.domElement.offsetHeight / 2);

  var boundingRect = this.box.getBoundingClientRect();

  // update the box overlays position
  this.box.style.left = (posx - boundingRect.width) + 'px';
  this.box.style.top = posy + 'px';
};

//--------------------------------
function Marker(lat,lng, index) {
  THREE.Object3D.call(this);

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

Marker.prototype = Object.create(THREE.Object3D.prototype);

// ------ Earth object -------------------------------------------------

function Earth(radius, texture, texture2) {
  THREE.Object3D.call(this);

  this.userData.radius = radius;

  var earth = new THREE.Mesh(
    new THREE.SphereBufferGeometry(radius, 64.0, 48.0),
    new THREE.MeshPhongMaterial({
      map: texture2,
      color: "#66a3ff",
      bumpMap: texture,
      bumpScale: 0.0,
      
    })
  );

  var earthGlow = new THREE.Mesh(
    new THREE.SphereBufferGeometry(radius, 64.0, 48.0),
    new THREE.MeshPhongMaterial({
      map: texture2,
      color: "#66a3ff",
      bumpMap: texture,
      bumpScale: 0.0,
      
    })
  );

  this.add(earth);
  this.add(earthGlow);
}
var markerarry = [];
Earth.prototype = Object.create(THREE.Object3D.prototype);

Earth.prototype.createMarker = function (lat, lon, index) {
  var marker = new Marker(lat,lon,index);

  var latRad = lat * (Math.PI / 180);
  var lonRad = -lon * (Math.PI / 180);
  var r = this.userData.radius;

  marker.position.set(Math.cos(latRad) * Math.cos(lonRad) * r, Math.sin(latRad) * r, Math.cos(latRad) * Math.sin(lonRad) * r);
  marker.rotation.set(0.0, -lonRad, latRad - Math.PI * 0.5);

  this.add(marker);
};



class CubeContainer extends React.Component {
  constructor(props){
    super(props);
    this.data = [];
    for( let i = 0 ; i< 5000; i++ ) {
      let latLng = {};
      let cordinate = randomCordinates().split(",") ;
      latLng.lat = cordinate[0]
      latLng.lng = cordinate[1]
      this.data.push(latLng)
      
    }
    this.state = {
      earthRotationX: 0.0000001,
      earthRotationY: 0.001
    }
    
  }

  componentDidMount() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    //ADD SCENE
    this.scene = new THREE.Scene()
    //ADD CAMERA
    this.camera = new THREE.PerspectiveCamera(
      50,
      width / height,
      0.1,
      1000
    )
    this.camera.position.z = 4
    //ADD RENDERER
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setClearColor('#000000')
    this.renderer.setSize(width, height)
    this.mount.appendChild(this.renderer.domElement)
    //ADD CUBE
    // var directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    // directionalLight.position.set(1000, 500, 200)
    // this.scene.add(directionalLight);
    var light = new THREE.AmbientLight(0x404040, 10); // soft white light
    this.scene.add(light);
    var texture = new THREE.TextureLoader().load(imge);
    var texture2 = new THREE.TextureLoader().load(imge2);

    var controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.earth = new Earth(1.0, texture2, texture);

    this.data.forEach( (element, index) => {
      this.earth.createMarker(element.lat, element.lng, index); // Paris  
    });

    // this.earth.createMarker(48.856700, 2.350800, 1); // Paris
    // this.earth.createMarker(51.507222, -0.1275, 2); // London
    // this.earth.createMarker(34.050000, -118.250000,3); // LA
    // this.earth.createMarker(41.836944, -87.684722,4); // Chicago
    // this.earth.createMarker(35.683333, 139.683333,5); // Tokyo
    // this.earth.createMarker(33.333333, 44.383333,6); // Baghdad
    // this.earth.createMarker(40.712700, -74.005900,7); // New York

    // this.earth.createMarker(55.750000, 37.616667,8); // Moscow
    // this.earth.createMarker(35.117500, -89.971111,9); // Memphis
    // this.earth.createMarker(-33.925278, 18.423889,10); // Cape Town
    // this.earth.createMarker(32.775833, -96.796667,11); // Dallas
    // this.earth.createMarker(52.366667, 4.900000,12); // Amsterdam
    // this.earth.createMarker(42.358056, -71.063611,13); // Boston
    // this.earth.createMarker(52.507222, 13.145833,14); // Berlin
    // this.earth.createMarker(18.5204, 73.8567,15, 1); // pune

    // this.earth.createMarker(37.783333, -122.416667); // San Francisco
    this.scene.add(this.earth)


      //----------------
      window.addEventListener('click', this.onmousemove)

    this.start()
  }
  onmousemove = (event) => {
    const rect = this.renderer.domElement.getBoundingClientRect();
    const left = event.clientX - rect.left;
    const top = event.clientY - rect.top;
  
    const x = (left / rect.width) * 2 - 1;
    const y = - (top / rect.height) * 2 + 1;
    
    const raycaster = new THREE.Raycaster();
    raycaster.ray.origin.setFromMatrixPosition(this.camera.matrixWorld);
    raycaster.ray.direction.set(x, y, 0.5).unproject(this.camera).sub(raycaster.ray.origin).normalize();
    
    const intersects = raycaster.intersectObjects(this.earth.children, true);
    console.log("INTERSECTS ===>>>", intersects)
    if(intersects.length > 0) {
      if(intersects[0].object.geometry.type === "CylinderBufferGeometry"){
        
        // if(!intersects[0].object.clicked){
        //   intersects[0].object.material.color.setHex(0xff0000)
        //   intersects[0].object.clicked = true
        // } else {
        //   intersects[0].object.material.color.setHex(0xff6600)
        //   intersects[0].object.clicked = false
        // }
        const {userData} = intersects[0].object;
        console.log(`Marker:${userData.index}  Latitude: ${userData.lat} Longitude:${userData.lng}`)
        
      }
    }
  }
  componentWillUnmount() {
    this.stop()
    this.mount.removeChild(this.renderer.domElement)
  }
  start = () => {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate)
    }
  }
  stop = () => {
    cancelAnimationFrame(this.frameId)
  }
  onMouseOver = () => {
    this.setState({
      earthRotationX: 0,
      earthRotationY: 0
    })
  }
  onMouseLeave = () => {
    this.setState({
      earthRotationX: 0.0000001,
      earthRotationY: 0.001
    })
  }
  animate = () => {
    const { earthRotationX, earthRotationY } = this.state;
    this.earth.rotation.x += earthRotationX
    this.earth.rotation.y += earthRotationY
    this.renderScene()
    
    this.frameId = window.requestAnimationFrame(this.animate)
  }
  renderScene = () => {
    this.renderer.render(this.scene, this.camera)
  }
  render() {
    return (
      <div
        className="cubeContainer"
        style={{ width: window.innerWidth, height: window.innerHeight }}
        ref={(mount) => { this.mount = mount }}
        onMouseOver = { this.onMouseOver }
        onMouseLeave = {this.onMouseLeave }
      >
      </div>
    );
  }
}
export default CubeContainer;