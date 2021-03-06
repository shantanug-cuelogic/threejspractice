import React from "react";
import { Link } from "react-router-dom";

class ExamplesContainer extends React.Component {
    render(){
        return(
            <div>
                EXAMPLE CONTAINER
                <div>
                    <Link to={"examples/cube"} > Cube Example</Link>
                    <Link to={"examples/line"} > Line Example</Link>
                    <Link to={"examples/globe"} > Globe Example</Link>
                    <Link to={"examples/marker"} > Globe Marker Example</Link>
                    <Link to = {"examples/1"}> Globe Marker Example(Optimization) </Link>
                    <Link to = {"examples/2"}> Globe Example(Optimization) </Link>
                </div>
            </div>
        );
    }
}

export default ExamplesContainer;