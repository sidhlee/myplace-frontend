import React from 'react';
import ReactDOM from 'react-dom';
import './SideDrawer.css';

const SideDrawer = (props) => {
  const content = (
    <aside className={`side-drawer ${props.className}`} style={props.style}>
      {props.children}
    </aside>
  );
  // Semantically, side-drawer should be a sibling to our App instead of its child
  // because side-draw can be on top of the entire App components
  // 'content' is still part of the Virtual DOM tree, but is rendered at some place else.
  return ReactDOM.createPortal(content, document.getElementById('drawer-hook'));
};

export default SideDrawer;
