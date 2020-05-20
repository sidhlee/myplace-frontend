import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import './SideDrawer.css';

const SideDrawer = (props) => {
  const content = (
    <CSSTransition
      in={props.show}
      timeout={200}
      classNames="slide-in-left"
      mountOnEnter
      unmountOnExit
    >
      <aside
        className={`side-drawer ${props.className}`}
        style={props.style}
        onClick={props.handleSideDrawerClick}
      >
        {props.children}
      </aside>
    </CSSTransition>
  );
  // Semantically, side-drawer should be a sibling to our App instead of its child
  // because side-draw can be on top of the entire App components
  // 'content' is still part of the Virtual DOM tree, but is rendered at some place else.
  return ReactDOM.createPortal(content, document.getElementById('drawer-hook'));
};

export default SideDrawer;
