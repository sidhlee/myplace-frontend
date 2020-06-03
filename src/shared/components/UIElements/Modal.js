import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import Backdrop from './Backdrop';

import './Modal.css';

const ModalOverlay = (props) => {
  const content = (
    <div className={`modal ${props.className}`} style={props.style}>
      <header className={`modal__header ${props.headerClass}`}>
        <h2>{props.header}</h2>
      </header>
      <form
        onSubmit={
          props.onSubmit
            ? props.onSubmit
            : (e) => {
                e.preventDefault();
              }
        }
      >
        <div className={`modal__content ${props.contentClass}`}>
          {props.children}
        </div>
        <footer className={`modal__footer ${props.footerClass}`}>
          {props.footer}
        </footer>
      </form>
    </div>
  );
  return ReactDOM.createPortal(content, document.getElementById('modal-hook'));
};

const Modal = (props) => {
  return (
    <div className={`modal ${props.className}`} style={props.style}>
      {props.show && <Backdrop handleClick={props.onCancel} />}
      <CSSTransition
        in={props.show}
        mountOnEnter
        unmountOnExit
        timeout={200}
        classNames="modal"
      >
        <ModalOverlay {...props} />
      </CSSTransition>
    </div>
  );
};

Modal.propTypes = {
  className: PropTypes.string,
  style: PropTypes.string,
  show: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  headerClass: PropTypes.string,
  header: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  onSubmit: PropTypes.func,
  contentClass: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
    .isRequired,
  footer: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
};

export default Modal;
