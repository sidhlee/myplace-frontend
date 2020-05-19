import React from 'react';
import './MainHeader.css';

const MainHeader = (props) => {
  return (
    <header className={`main-header ${props.className}`} style={props.style}>
      {props.children}
    </header>
  );
};

export default MainHeader;
