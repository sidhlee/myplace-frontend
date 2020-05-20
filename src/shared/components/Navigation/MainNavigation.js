import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import MainHeader from './MainHeader';
import NavLinks from './NavLinks';
import Backdrop from '../UIElements/Backdrop';
import SideDrawer from './SideDrawer';
import './MainNavigation.css';

const MainNavigation = (props) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleMenuButtonClick = () => {
    setIsDrawerOpen(true);
  };

  const closeSideDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <React.Fragment>
      {isDrawerOpen && <Backdrop handleClick={closeSideDrawer} />}
      <SideDrawer show={isDrawerOpen} handleSideDrawerClick={closeSideDrawer}>
        <nav className="main-navigation__drawer-nav">
          <NavLinks />
        </nav>
      </SideDrawer>
      <MainHeader
        className={`main-navigation ${props.className}`}
        style={props.style}
      >
        <button
          className="main-navigation__menu-btn"
          onClick={handleMenuButtonClick}
        >
          <span />
          <span />
          <span />
        </button>
        <h1 className="main-navigation__title">
          <Link to="/">YourPlaces</Link>
        </h1>
        <nav className="main-navigation__header-nav">
          <NavLinks />
        </nav>
      </MainHeader>
    </React.Fragment>
  );
};

export default MainNavigation;
