import React from 'react';
import {Route} from "react-router-dom";
import './App.css';
import ViewContainer from "./View";

function App() {
  return (
    <div className="App">
        
        <Route path={"/"} component={ViewContainer} ></Route>
    </div>
  );
}

export default App;
