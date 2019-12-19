import React from "react";
import { Route, Switch } from "react-router-dom";
import ExampleContainer from "./ExamplesContainer";
import Cube from "./Components/Cube";
import Line from "./Components/Line";
import Globe from "./Components/Globe";
import Marker from "./Components/Marker";
import NewGlobe from "./Components/NewGlobe";

const index = ( {match} ) => {
    return(
        <Switch>
            <Route path={`${match.path}/line`} component={Line}></Route>
            <Route path={`${match.path}/cube`} component={Cube}></Route>
            <Route path={`${match.path}/globe`} component={Globe}></Route>
            <Route path={`${match.path}/marker`} component={Marker}></Route>
            <Route path={`${match.path}/newglobe`} component={NewGlobe}></Route>
            <Route path={"/"} component={ExampleContainer} ></Route>
        </Switch>
    );
}

export default index;