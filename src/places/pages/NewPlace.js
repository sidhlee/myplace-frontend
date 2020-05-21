import React, { useCallback } from 'react';
import Input from '../../shared/components/FormElements/Input';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from '../../shared/util/validators';

import './NewPlace.css';

const NewPlace = () => {
  // without useCallback, this function is created every time NewPlace is rendered
  // then passed to Input component which will cause it to call this function in effect hook.

  const titleInputChangeCallback = useCallback((id, value, isValid) => {}, []); // re-use this function when NewPlace re-renders
  const descriptionInputChangeCallback = useCallback((id, value, isValid) => {},
  []); // re-use this function when NewPlace re-renders

  return (
    <form className="place-form">
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title"
        inputChangeCallback={titleInputChangeCallback}
      />
      <Input
        id="description"
        element="textarea"
        type="text"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]} // this is superset of require
        errorText="Please enter a valid description at least 5 characters"
        handleInputChange={descriptionInputChangeCallback}
      />
    </form>
  );
};

export default NewPlace;
