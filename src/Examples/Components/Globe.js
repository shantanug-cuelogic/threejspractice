import React from "react";
import * as THREE from "three";
import imge from '../../Assets/earth-dark.jpg'
import imge2 from '../../Assets/earth-topology.png' //earth-topology
var OrbitControls = require('three-orbit-controls')(THREE)

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
        this.renderer = new THREE.WebGLRenderer({ antialias: false })
        this.renderer.setClearColor('#000000')
        this.renderer.setSize(width, height)
        this.mount.appendChild(this.renderer.domElement)
        //ADD CUBE
        var directionalLight = new THREE.DirectionalLight(0xffffff, 2);
            directionalLight.position.set(1000,500 ,200)
        this.scene.add(directionalLight); 
        var light = new THREE.AmbientLight( 0x404040, 5 ); // soft white light
        this.scene.add( light );
        var earthImage = new THREE.TextureLoader().load('https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg');
        var topology = new THREE.TextureLoader().load('https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png');
        const geometry = new THREE.SphereGeometry(1, 50, 50);
        const material = new THREE.MeshPhongMaterial({  
            wireframe: false, 
            map: earthImage, 
            bumpMap: topology,
            bumpScale: 0
        
        })
    
        this.cube = new THREE.Mesh(geometry, material)
        this.scene.add(this.cube)
        var controls = new OrbitControls( this.camera, this.renderer.domElement );
        


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
        this.cube.rotation.x += 0.0000001
        this.cube.rotation.y += 0.001
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