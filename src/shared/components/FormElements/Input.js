import React, { useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';

import { validate } from '../../util/validators';
import './Input.css';

const inputReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE':
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators),
      };
    case 'TOUCH':
      return {
        ...state,
        isTouched: true,
      };
    default:
      return state;
  }
};

const Input = (props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || '', // initialize value if provided. If not, default to ''
    isValid: props.initialIsValid || false,
    isTouched: false,
  });

  // destructure props to pass specific prop to dep list
  const { id, inputChangeCallback } = props;
  const { value, isValid } = inputState;

  useEffect(() => {
    inputChangeCallback(id, value, isValid);

    // if we pass props here, this might cause infinite loop & render too often
  }, [id, inputChangeCallback, value, isValid]);

  const handleChange = (e) => {
    dispatch({
      type: 'CHANGE',
      val: e.target.value,
      validators: props.validators,
    });
  };
  // only give warning when the input is blurred
  // (not throwing error while user is typing)
  const handleBlur = () => {
    dispatch({ type: 'TOUCH' });
  };

  const element =
    props.element === 'input' ? (
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onChange={handleChange}
        onBlur={handleBlur}
        value={inputState.value}
      />
    ) : (
      <textarea
        id={props.id}
        rows={props.rows || 3}
        onChange={handleChange}
        onBlur={handleBlur}
        value={inputState.value}
      /> // fallback to 3
    );

  return (
    <div
      className={`form-control ${
        !inputState.isValid && inputState.isTouched && 'form-control--invalid'
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
  );
};

// Input takes id as required prop to reuse same change handler which will send back
// the id , value and the validity of the input to update the form state in parent component
//
// Without id, it will be hard to know which Input component called the change handler
Input.propTypes = {
  id: PropTypes.string.isRequired,
  element: PropTypes.string.isRequired,
  type: PropTypes.string,
  label: PropTypes.string.isRequired,
  inputChangeCallback: PropTypes.func.isRequired,
  errorText: PropTypes.string.isRequired,
  validator: PropTypes.arrayOf(
    PropTypes.objectOf({ type: PropTypes.string.isRequired })
  ),
  placeholder: PropTypes.string,
  rows: PropTypes.number,
};

export default Input;
