import React from 'react';

import './SideDrawer.css';

const SideDrawer = (props) => {
  return (
    <aside className={`side-drawer ${props.className}`} style={props.style}>
      {props.children}
    </aside>
  );
};

export default SideDrawer;
