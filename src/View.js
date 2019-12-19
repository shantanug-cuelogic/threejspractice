import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import ExampleContainer from "./Examples";

class ViewContainer extends React.Component {
    render() {
        return (
            <div>
                {/* <Redirect to={"/examples"} /> */}
                <Switch>
                    <Route path={"/examples"} component={ExampleContainer}></Route>
                    <Redirect from="/" to="/examples" ></Redirect>    
                </Switch>

            </div>
        );
    }
}

export default ViewContainer;