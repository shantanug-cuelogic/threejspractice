import React from "react";
import * as THREE from "three";
import WebWorker from './test.worker';
import imge from '../../Assets/earth-dark.jpg'
import imge2 from '../../Assets/earth-topology.png' //earth-topology
import randomCordinates from "random-coordinates";
var OrbitControls = require('three-orbit-controls')(THREE)


class CubeContainer extends React.Component {
  constructor(props) {
    super(props);
    this.earthRotationX = 0.0000000
    this.earthRotationY = 0.001
    this.state = {
      earthRotationX: this.earthRotationX,
      earthRotationY: this.earthRotationY,
      globeLoader: false
    }
    this.dataGeneratorWorker = new Worker('./dataGenerator.worker.js', { type: 'module' });
    this.dataGeneratorWorker.onmessage = event => {
      this.setState({
        globeLoader: true
      }, () => {
        this.plotMarker(event.data)
      })
    };
  }

  plotMarker = (data) => {
    for (var i = this.group2.children.length - 1; i >= 0; i--) {
      this.group2.remove(this.group2.children[i]);
    }
    data.forEach((element, index) => {
      var lat = element.lat;
      var lon = element.lng;
      var radius = 0.002;
      var threatDetectedRadius = 0.004;
      var circleRadius = 0.015
      var height = Math.random() * 0.8;

      if (element.type === "THREAT_UNDETECTED") {

        var materialYellowLines = new THREE.LineBasicMaterial({
          color: "#F7F707",
          linewidth: 1,
          linecap: 'round', //ignored by WebGLRenderer
          linejoin: 'round' //ignored by WebGLRenderer,

        });

        var cone = new THREE.Mesh(new THREE.CylinderBufferGeometry(radius, circleRadius, 0.01, 30), materialYellowLines);
        cone.position.y = -0.05//height * 0.5;
        cone.rotation.x = Math.PI;
        cone.userData = { index: index, lat: lat, lng: lon }


      } else {
        var materialRedLines = new THREE.LineBasicMaterial({
          color: "#E80606",
          linewidth: 1,
          linecap: 'round', //ignored by WebGLRenderer
          linejoin: 'round' //ignored by WebGLRenderer,

        });
        var cone = new THREE.Mesh(new THREE.CylinderBufferGeometry(threatDetectedRadius, threatDetectedRadius, height, 30), materialRedLines);
        cone.position.y = height * 0.5;
        cone.rotation.x = Math.PI;
        cone.userData = { index: index, lat: lat, lng: lon }
      }
      this.marker = cone;

      var latRad = lat * (Math.PI / 180);
      var lonRad = -lon * (Math.PI / 180);
      var r = 1.0;

      this.marker.position.set(Math.cos(latRad) * Math.cos(lonRad) * r, Math.sin(latRad) * r, Math.cos(latRad) * Math.sin(lonRad) * r);
      this.marker.rotation.set(0.0, -lonRad, latRad - Math.PI * 0.5);

      this.group2.add(this.marker);
    });
    this.group.add(this.group2)
    this.setState({ globeLoader: false })

  }

  componentDidMount() {
    const width = window.innerWidth * 0.8;
    const height = window.innerHeight * 0.8;
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
    var light = new THREE.AmbientLight(0x404040, 40); // soft white light
    this.scene.add(light);
    var texture2 = new THREE.TextureLoader().load(imge);
    var texture = new THREE.TextureLoader().load(imge2);

    var controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.group = new THREE.Group();
    this.group2 = new THREE.Group();
    this.earth = new THREE.Mesh(
      new THREE.SphereBufferGeometry(1.0, 64.0, 48.0),
      new THREE.MeshPhongMaterial({
        map: texture2,
        color: "#66a3ff",
        bumpMap: texture,
        bumpScale: 0.0,

      })
    );

    this.group.add(this.earth)
    this.dataGeneratorWorker.postMessage({ TYPE: "ALL" });
    this.scene.add(this.group)
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

    const intersects = raycaster.intersectObjects(this.group.children, true);
    if (intersects.length > 0) {
      if (intersects[0].object.geometry.type === "CylinderBufferGeometry") {

        // if(!intersects[0].object.clicked){
        //   intersects[0].object.material.color.setHex(0xff0000)
        //   intersects[0].object.clicked = true
        // } else {
        //   intersects[0].object.material.color.setHex(0xff6600)
        //   intersects[0].object.clicked = false
        // }
        const { userData } = intersects[0].object;
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
      earthRotationX: this.earthRotationX,
      earthRotationY: this.earthRotationY
    })
  }
  animate = () => {
    const { earthRotationX, earthRotationY } = this.state;
    this.group.rotation.x += earthRotationX;
    this.group.rotation.y += earthRotationY;
    this.renderScene()

    this.frameId = window.requestAnimationFrame(this.animate)
  }
  renderScene = () => {
    this.renderer.render(this.scene, this.camera)
  }

  filterGlobe = (type) => {
    this.setState({ globeLoader: true }, () => {
      this.dataGeneratorWorker.postMessage({ TYPE: type });
    })
  }
  render() {
    return (
      <div>
       
       <p>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
        </p>
        { false //this.state.globeLoader 
        ?
          <div>
            <div className="loader">

            </div>
          </div>

          :
          <div
            style={{ padding: 10 }}
            className="cubeContainer"
            style={{ width: window.innerWidth, height: window.innerHeight }}
            ref={(mount) => { this.mount = mount }}
            onMouseOver={this.onMouseOver}
            onMouseLeave={this.onMouseLeave}
          >
          </div>
        }


        <div>
          <button onClick={() => this.filterGlobe("ALL")} >ALL</button>
          <button onClick={() => this.filterGlobe("THREAT_DETECTED")}  >DETECTED</button>
          <button onClick={() => this.filterGlobe("THREAT_UNDETECTED")}  >UNDETECTED</button>
        </div>
        <p>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
        </p>
      </div>

    );
  }
}
export default CubeContainer;