import React, { Component } from 'react';

import SidebarMenu from './components/SidebarMenu';
import RaceRouter from './components/RaceRouter';
import {
  BrowserRouter as Router
} from "react-router-dom";

import 'primereact/resources/themes/vela-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './App.css';

class App extends Component {

  render() {
    return (<div className="App">
      <Router >
      <SidebarMenu />
      <RaceRouter />
      </Router>
    </div>);
  };
}

export default App;
