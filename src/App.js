import React, { Component } from "react";
import "./App.css";
import Home from "./pages/Home";
import Calib from "./pages/Calib";
import Result from "./pages/Result";
import Reference from "./pages/Reference";
import Navbar from "./components/ultilites/Navbar";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

function App() {
  return (
    <div>
      <Navbar />
      <Router>
        <div className="App">
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route exact path="/home">
              <Home />
            </Route>
            <Route exact path="/reference">
              <Reference />
            </Route>
            <Route exact path="/calib/:id">
              <Calib />
            </Route>
            <Route exact path="/result">
              <Result />
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
