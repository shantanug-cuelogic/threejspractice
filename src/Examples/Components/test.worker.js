// WebWorker.js
import * as THREE from "three";

onmessage = (e) => {
  
  var group2 = new THREE.Group();
  e.data.forEach((element, index) => {

    var lat = element.lat;
    var lon = element.lng;
    var radius = 0.002;
    var circleRadius = 0.003
    var height = Math.random() * 0.8;
  
    if (index % 2 == 0) {
  
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
      var cone = new THREE.Mesh(new THREE.CylinderBufferGeometry(radius, radius, height, 30), materialRedLines);
      cone.position.y = height * 0.5;
      cone.rotation.x = Math.PI;
      cone.userData = { index: index, lat: lat, lng: lon }
    }
    var marker = cone;
  
    var latRad = lat * (Math.PI / 180);
    var lonRad = -lon * (Math.PI / 180);
    var r = 1.0;
  
    marker.position.set(Math.cos(latRad) * Math.cos(lonRad) * r, Math.sin(latRad) * r, Math.cos(latRad) * Math.sin(lonRad) * r);
    marker.rotation.set(0.0, -lonRad, latRad - Math.PI * 0.5);
  
    group2.add(marker);


   })

   function str2ab(str) {
    var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
    var bufView = new Uint16Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }
  console.log("IN WORKER ===>>>", group2)
  let str = str2ab( JSON.stringify(group2) )


  postMessage(JSON.stringify(group2));
  }