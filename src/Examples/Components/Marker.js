import React from "react";
import * as THREE from "three";
import imge from '../../Assets/earth-dark.jpg'
import imge2 from '../../Assets/earth-topology.png' //earth-topology
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
  
  InfoBox.prototype.update = function() {
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
  function Marker() {
    THREE.Object3D.call(this);
  
    var radius = 0.005;
    var sphereRadius = 0.02;
    var height = 0.2;
  
    var material = new THREE.MeshPhongMaterial({
      color: "#E36009"
    });
  
    var cone = new THREE.Mesh(new THREE.ConeBufferGeometry(radius, height, 8, 1, true), material);
    cone.position.y = height * 0.5;
    cone.rotation.x = Math.PI;
  
    var sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(sphereRadius, 16, 8), material);
    sphere.position.y = height * 0.95 + sphereRadius;
  
  
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
        map: texture,
        bumpMap: texture2,
        bumpScale: 0.8
      })
    );
  
    this.add(earth);
  }
  var markerarry= [];
  Earth.prototype = Object.create(THREE.Object3D.prototype);
  
  Earth.prototype.createMarker = function(lat, lon) {
    var marker = new Marker();
  
    var latRad = lat * (Math.PI / 180);
    var lonRad = -lon * (Math.PI / 180);
    var r = this.userData.radius;
  
    marker.position.set(Math.cos(latRad) * Math.cos(lonRad) * r, Math.sin(latRad) * r, Math.cos(latRad) * Math.sin(lonRad) * r);
    marker.rotation.set(0.0, -lonRad, latRad - Math.PI * 0.5);
  
    this.add(marker);
  };
  


class CubeContainer extends React.Component {
    componentDidMount() {
        const width = window.innerWidth//this.mount.clientWidth
        const height = window.innerHeight//this.mount.clientHeight
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
        // this.renderer.setClearColor('#000000')
        this.renderer.setSize(width, height)
        this.mount.appendChild(this.renderer.domElement)
        //ADD CUBE
        var directionalLight = new THREE.DirectionalLight(0xffffff, 2);
            directionalLight.position.set(1000,500 ,200)
        this.scene.add(directionalLight); 
        var light = new THREE.AmbientLight( 0x404040, 10 ); // soft white light
        this.scene.add( light );
        var texture = new THREE.TextureLoader().load(imge);
        var texture2 = new THREE.TextureLoader().load(imge2);
//         const geometry = new THREE.SphereGeometry(1, 50, 50);
//         const material = new THREE.MeshPhongMaterial({  
//             wireframe: false, 
//             map: texture, 
//             bumpMap: texture2,
//             bumpScale: 0.8
        
//         })
//         this.group = new THREE.Group();
//         this.scene.add( this.group );
// //				addShape( californiaShape, extrudeSettings, 0xf08000, - 300, - 100, 0, 0, 0, 0, 1 );

//         this.cube = new THREE.Mesh(geometry, material)
//         this.group.add(this.cube)
        var controls = new OrbitControls( this.camera, this.renderer.domElement );
        
        // this.cube.add(this.cube)
         this.earth = new Earth(1.0, texture2, texture);

         this.earth.createMarker(48.856700, 2.350800); // Paris
         this.earth.createMarker(51.507222, -0.1275); // London
         this.earth.createMarker(34.050000, -118.250000); // LA
         this.earth.createMarker(41.836944, -87.684722); // Chicago
         this.earth.createMarker(35.683333, 139.683333); // Tokyo
         this.earth.createMarker(33.333333, 44.383333); // Baghdad
         this.earth.createMarker(40.712700, -74.005900); // New York
      
         this.earth.createMarker(55.750000, 37.616667); // Moscow
         this.earth.createMarker(35.117500, -89.971111); // Memphis
         this.earth.createMarker(-33.925278, 18.423889); // Cape Town
         this.earth.createMarker(32.775833, -96.796667); // Dallas
         this.earth.createMarker(52.366667, 4.900000); // Amsterdam
         this.earth.createMarker(42.358056, -71.063611); // Boston
         this.earth.createMarker(52.507222, 13.145833); // Berlin
         this.earth.createMarker(18.5204, 73.8567); // pune
      
         this.earth.createMarker(37.783333, -122.416667); // San Francisco
this.scene.add(this.earth)
        this.start()
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
    animate = () => {
        this.earth.rotation.x += 0.00001
        this.earth.rotation.y += 0.005
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
                
            >
            </div>
        );
    }
}
export default CubeContainer;