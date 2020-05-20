import React from 'react';
import ReactDOM from 'react-dom';

import './Backdrop.css';

const Backdrop = (props) => {
  return ReactDOM.createPortal(
    <div
      className={`backdrop ${props.className}`}
      style={props.style}
      onClick={props.handleClick}
    ></div>,
    document.getElementById('backdrop-hook')
  );
};

export default Backdrop;
