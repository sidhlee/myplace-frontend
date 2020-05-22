import React from 'react';
import { Link } from 'react-router-dom';

import './Button.css';

/**
 *
 * @param {{children, size?:string, inverse?:boolean, danger?:boolean, href?:string, to?:string, exact?:boolean, type?:string, disabled?:boolean, handleClick?: Function}} props
 */
const Button = (props) => {
  // applying same styling for different kinds of buttons
  const classes = `button button--${props.size || 'default'} ${
    props.inverse && 'button--inverse'
  } ${props.danger && 'button--danger'}`;

  if (props.href) {
    return (
      <a className={classes} href={props.href}>
        {props.children}
      </a>
    );
  }
  if (props.to) {
    return (
      <Link to={props.to} exact={props.exact} className={classes}>
        {props.children}
      </Link>
    );
  }
  return (
    <button
      className={classes}
      type={props.type}
      onClick={props.handleClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

export default Button;
