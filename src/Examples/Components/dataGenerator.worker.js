import randomCordinates from "random-coordinates";


onmessage = (e) => {
    
    var data = [];
    switch(e.data.TYPE) {
        case "ALL" : 
        for (let i = 0; i < 4000; i++) {
            let latLng = {};
            let cordinate = randomCordinates().split(",");
            latLng.lat = cordinate[0];
            latLng.lng = cordinate[1];
            latLng.type = i % 2 == 0 ? "THREAT_DETECTED" : "THREAT_UNDETECTED"; 
            data.push(latLng)
        
          }
        break;
        case "THREAT_DETECTED" : 
        for (let i = 0; i < 5000; i++) {
            let latLng = {};
            let cordinate = randomCordinates().split(",");
            latLng.lat = cordinate[0]
            latLng.lng = cordinate[1]
            latLng.type = "THREAT_DETECTED"
            data.push(latLng)
        
          }
        break;

        case "THREAT_UNDETECTED" : 
        for (let i = 0; i < 6000; i++) {
            let latLng = {};
            let cordinate = randomCordinates().split(",");
            latLng.lat = cordinate[0]
            latLng.lng = cordinate[1]
            latLng.type = "THREAT_UNDETECTED"
            data.push(latLng)
        
          }
        break;
        default : 
    }
    
      postMessage(data)
}








