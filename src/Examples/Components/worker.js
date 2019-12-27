// importScripts('three.js')

export default () => {
  

  self.addEventListener('message', e => { // eslint-disable-line no-restricted-globals
    

    console.log("MESSAGE ==>>", e);
    // console.log("THREE ===>>", THREE)
    // var THREE = e.data.three;
    // var group2 = new THREE.Group();

    // e.data.data.forEach((element, index) => {
    //   var lat = element.lat;
    //   var lon = element.lng;
    //   var radius = 0.002;
    //   var circleRadius = 0.003
    //   var height = Math.random() * 0.8;

    //   if (index % 2 == 0) {

    //     var materialYellowLines = new THREE.LineBasicMaterial({
    //       color: "#F7F707",
    //       linewidth: 1,
    //       linecap: 'round', //ignored by WebGLRenderer
    //       linejoin: 'round' //ignored by WebGLRenderer,

    //     });

    //     var cone = new THREE.Mesh(new THREE.CylinderBufferGeometry(radius, circleRadius, 0.01, 30), materialYellowLines);
    //     cone.position.y = -0.05//height * 0.5;
    //     cone.rotation.x = Math.PI;
    //     cone.userData = { index: index, lat: lat, lng: lon }


    //   } else {
    //     var materialRedLines = new THREE.LineBasicMaterial({
    //       color: "#E80606",
    //       linewidth: 1,
    //       linecap: 'round', //ignored by WebGLRenderer
    //       linejoin: 'round' //ignored by WebGLRenderer,

    //     });
    //     var cone = new THREE.Mesh(new THREE.CylinderBufferGeometry(radius, radius, height, 30), materialRedLines);
    //     cone.position.y = height * 0.5;
    //     cone.rotation.x = Math.PI;
    //     cone.userData = { index: index, lat: lat, lng: lon }
    //   }

    //   var latRad = lat * (Math.PI / 180);
    //   var lonRad = -lon * (Math.PI / 180);
    //   var r = 1.0;

    //   cone.position.set(Math.cos(latRad) * Math.cos(lonRad) * r, Math.sin(latRad) * r, Math.cos(latRad) * Math.sin(lonRad) * r);
    //   cone.rotation.set(0.0, -lonRad, latRad - Math.PI * 0.5);

    //   group2.add(cone);
    // var data = [];
    // for (let i = 0; i < 50; i++) {
    //   let latLng = {};
    //   let cordinate = randomCordinates().split(",");
    //   latLng.lat = cordinate[0]
    //   latLng.lng = cordinate[1]
    //   data.push(latLng)

    // }
    postMessage("hi");
  });
}
