import React, { useState } from 'react';

import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { Link } from "react-router-dom";

function SidebarMenu() {

  const [activeSidebar, setActiveSidebar] = useState(false);
  const [events, setEvents] = useState([]);

  return (
    <div className="App">
      <div className="topbar p-shadow-2 p-p-1">
         <Button icon="pi pi-bars" className="p-button-rounded" onClick={() => setActiveSidebar(true)} />
      </div>

      <Sidebar visible={activeSidebar} onHide={() => setActiveSidebar(false)}>
        <div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/page-1">About</Link>
          </li>
        </ul>
        </div>
      </Sidebar>
    </div>
  );
}

export default SidebarMenu;
