import { useCallback, useReducer } from 'react';

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
    case 'SET_DATA':
      return {
        // overwrite existing state
        // so no spreading
        inputs: action.inputs,
        isValid: action.formIsValid,
      };
    default:
      return state;
  }
};

export const useForm = (initialInputs, initialFormValidity) => {
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: initialInputs,
    isValid: initialFormValidity,
  });

  // without useCallback, this function is created every time NewPlace is rendered
  // then passed to Input component which will cause it to call this function in effect hook.
  //
  // this callback can be passed to different child components because it receives
  // component id as argument
  const inputChangeCallback = useCallback((id, value, isValid) => {
    dispatch({
      type: 'INPUT_CHANGE',
      inputId: id,
      value,
      isValid,
    });
  }, []); // re-use this function when NewPlace re-renders

  const setFormDataCallback = useCallback((inputData, formValidity) => {
    dispatch({
      type: 'SET_DATA',
      inputs: inputData,
      FormIsValid: formValidity,
    });
  }, []);

  return [formState, inputChangeCallback, setFormDataCallback];
};
