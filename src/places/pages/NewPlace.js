import React, { useCallback, useReducer } from 'react';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from '../../shared/util/validators';

import './NewPlace.css';
// when any of input is changed, re-evaluate the validity of the entire form
const formReducer = (state, action) => {
  switch (action.type) {
    case 'INPUT_CHANGE':
      let formIsValid = true;
      // for each input object in inputs object
      for (const inputId in state.inputs) {
        // if input's id matches dispatched action's id
        if (inputId === action.inputId) {
          // form becomes invalid if action.isValid is false
          formIsValid = formIsValid && action.isValid;
        } else {
          // if inputId doesn't match action.inputId,
          // recalculate form's validity based on current state of the input
          // TODO: why do we need this check?
          formIsValid = formIsValid && state.inputs[inputId].isValid;
        }
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: { value: action.value, isValid: action.isValid },
        },
        isValid: formIsValid,
      };
    default:
      return state;
  }
};

const NewPlace = () => {
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: {
      title: {
        value: '',
        isValid: false,
      },
      description: {
        value: '',
        isValid: false,
      },
    },
    isValid: false,
  });

  // without useCallback, this function is created every time NewPlace is rendered
  // then passed to Input component which will cause it to call this function in effect hook.
  //
  // this callback can be passed to different child components because it receives
  // component id as argument
  const inputChangeCallback = useCallback((id, value, isValid) => {
    dispatch({ type: 'INPUT_CHANGE', inputId: id, value, isValid });
  }, []); // re-use this function when NewPlace re-renders

  return (
    <form className="place-form">
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title"
        inputChangeCallback={inputChangeCallback}
      />
      <Input
        id="description"
        element="textarea"
        type="text"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]} // this is superset of require
        errorText="Please enter a valid description at least 5 characters"
        inputChangeCallback={inputChangeCallback}
      />
      <Button type="submit" disabled={!formState.isValid}>
        ADD PLACE
      </Button>
    </form>
  );
};

export default NewPlace;
