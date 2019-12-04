import React from "react";
import { Route, Switch } from "react-router-dom";
import ExampleContainer from "./ExamplesContainer";
import Cube from "./Components/Cube";

const index = ( {match} ) => {
    return(
        <Switch>
            <Route path={`${match.path}/cube`} component={Cube}></Route>
            <Route path={"/"} component={ExampleContainer} ></Route>
        </Switch>
    );
}

export default index;