import React, { Component } from "react";
import "./App.css";
import Home from "./pages/Home";
import Calib from "./pages/Calib";
import Result from "./pages/Result";
import Navbar from "./components/ultilites/Navbar";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import { theme } from "./style/CustomTheme";

function App() {
  return (
    <ThemeProvider theme={theme}>
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
    </ThemeProvider>
  );
}

export default App;
