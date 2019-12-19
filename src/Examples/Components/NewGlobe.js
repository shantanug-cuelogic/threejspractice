import React from "react";
import * as THREE from "three";

class NewGlobe extends React.Component {

    componentDidMount() {
        console.log("THIS MOUNT ======>>>", this.mount)
        const height = window.innerHeight;
        const width = window.innerWidth;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
    }

    render() {
        return (<div ref={(mount) => this.mount = mount} >
            NEW GLOBE CONTAINER
        </div>)
    }
}
export default NewGlobe;