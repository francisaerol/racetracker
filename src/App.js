import SidebarMenu from './components/SidebarMenu';
import RaceRouter from './components/RaceRouter';

import {
  BrowserRouter as Router
} from "react-router-dom";

import 'primereact/resources/themes/arya-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './App.css';

function App(){

    return (<div className="App">
      <Router >
      <SidebarMenu />
      <RaceRouter />
      </Router>
    </div>);
}

export default App;
