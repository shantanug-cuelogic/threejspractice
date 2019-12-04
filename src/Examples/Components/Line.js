import React from "react";
import * as THREE from "three";

class LineContainer extends React.Component {
    componentDidMount() {
        const width = window.innerWidth//this.mount.clientWidth
        const height = window.innerHeight//this.mount.clientHeight
        //ADD SCENE
        this.scene = new THREE.Scene()
        //ADD CAMERA
        this.camera = new THREE.PerspectiveCamera(
            45,
            width / height,
            1,
            500
        )
        this.camera.position.set(0, 0, 100)
        //ADD RENDERER
        this.renderer = new THREE.WebGLRenderer()
        this.renderer.setSize(width, height)
        this.mount.appendChild(this.renderer.domElement)
        //ADD LINE
        var material = new THREE.LineBasicMaterial({ color: 0x0000ff })
        var geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(-10, 0, 0));
        geometry.vertices.push(new THREE.Vector3(0, 10, 0));
        geometry.vertices.push(new THREE.Vector3(10, 0, 0));
        geometry.vertices.push(new THREE.Vector3(0, -10, 0));
        geometry.vertices.push(new THREE.Vector3(-10, 0, 0));

        geometry.vertices.push(new THREE.Vector3(0, 0, 0));
        geometry.vertices.push(new THREE.Vector3(10, 10, 0));
        geometry.vertices.push(new THREE.Vector3(0, 10, 0));
        geometry.vertices.push(new THREE.Vector3(10, 0, 0));
        geometry.vertices.push(new THREE.Vector3(20, 0, 0));
        geometry.vertices.push(new THREE.Vector3(10, 10, 0));
        geometry.vertices.push(new THREE.Vector3(0, 0, 0));
        geometry.vertices.push(new THREE.Vector3(10, -10, 0));
        geometry.vertices.push(new THREE.Vector3(0, -10, 0));
        geometry.vertices.push(new THREE.Vector3(10, 0, 0));
        geometry.vertices.push(new THREE.Vector3(20, 0, 0));
        geometry.vertices.push(new THREE.Vector3(10,-10, 0));

        this.line = new THREE.Line(geometry, material);
        this.scene.add(this.line)
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
            />
        );
    }
}
export default LineContainer;