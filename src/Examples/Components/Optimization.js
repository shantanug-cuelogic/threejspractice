import React from "react";
import Globe from 'globe.gl';
import * as d3 from 'd3';
import randomCordinates from "random-coordinates";

class Optimization extends React.Component {
    constructor(props){
        super(props);
        this.data = [];
        console.log("BEFORE FOR ===>>");
        for( let i = 0 ; i< 10000; i++ ) {
          let latLng = {};
          let cordinate = randomCordinates().split(",") ;
          latLng.lat = cordinate[0];
          latLng.lng = cordinate[1];
          latLng.index = i;
          if(i%2){
            latLng.pop = Math.floor(Math.random() * Math.floor(10));
          } else {
            latLng.pop = 0
          }
          
          this.data.push(latLng)
          console.log("LATLNG ===>>", latLng)
          
        }
    }
    componentDidMount(){
        const weightColor = d3.scaleSequentialSqrt(d3.interpolateYlOrRd)
      .domain([0, 10]);

    const world = Globe()
      (document.getElementById('globeViz'))
      .globeImageUrl('https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg')
      .bumpImageUrl('https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png')
      .hexBinPointWeight('pop')
      .hexAltitude(d => d.sumWeight * 6e-3)
      .hexBinResolution(4)
      .hexTopColor(d => weightColor(d.sumWeight))
      .hexSideColor(d => weightColor(d.sumWeight))
      .hexBinMerge(false)
      .hexTransitionDuration(500)
      .onHexHover( (d) =>  console.log(d)  )
      .enablePointerInteraction(true); // performance improvement

    // fetch('https://vasturiano.github.io/globe.gl/example/datasets/world_population.csv')
    // .then(res => res.text())
    //   .then(csv => d3.csvParse(csv, ({ lat, lng, pop }) => ({ lat: +lat, lng: +lng, pop: +pop })))
    //   .then(data => { 
    //     console.log("DATA ===>", data)
    //     world.hexBinPointsData(data)
    //   });

    world.hexBinPointsData(this.data)
    // Add auto-rotation
    world.controls().autoRotate = true;
    world.controls().autoRotateSpeed = 0.5;
    }
    
    onClickMarker = ( MarkerData ) => {
        console.log("MARKER DATA ===>>",MarkerData)
    }

    
    render(){
        return(
            <div>
           <h1>
                OPTIMIZATION CONTAINER
            </h1>
            <div id="globeViz"></div>
            </div>
 
        )
    }
}

export default Optimization;