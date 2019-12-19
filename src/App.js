import React from 'react';
import {Route} from "react-router-dom";
import './App.css';
import ViewContainer from "./View";
import PWAPrompt from 'react-ios-pwa-prompt'

function App() {
  return (
    <div className="App">
        <PWAPrompt />

        <Route path={"/"} component={ViewContainer} ></Route>
    </div>
  );
}

export default App;
