import React, { Component } from "react";
import "./App.css";
import Home from "./pages/Home";
import Calib from "./pages/Calib";
import Result from "./pages/Result";
import Error from "./pages/Error";
import Navbar from "./components/ultilites/Navbar";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import { theme } from "./style/CustomTheme";
import Box from "@mui/material/Box";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ backgroundColor: "background.default", height: "100vh" }}>
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
              <Route exact path="/result/:id">
                <Result />
              </Route>
              <Route exact path="/error">
                <Error />
              </Route>
            </Switch>
          </div>
        </Router>
      </Box>
    </ThemeProvider>
  );
}

export default App;
