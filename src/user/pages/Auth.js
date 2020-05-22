import React, { useState, useContext } from 'react';

import Card from '../../shared/components/UIElements/Card';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { AuthContext } from '../../shared/context/auth-context';

import './Auth.css';

const Auth = (props) => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formState, inputChangeCallback, setFormDataCallback] = useForm(
    {
      email: {
        value: '',
        isValid: false,
      },
      password: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    console.log(formState.inputs);
    auth.login();
  };

  const switchMode = () => {
    // need to reset form data when we switch mode because we're adding /removing
    // name input based on isLoginMode state
    // we need to also add/remove name input in formState
    // to be aligned with the newly rendered form

    // if we're in signup mode & switching to login mode
    if (!isLoginMode) {
      const isLoginFormValid =
        formState.inputs.email.isValid && formState.inputs.password.isValid;
      setFormDataCallback(
        {
          ...formState.inputs,
          name: undefined, // drop the name field from signup mode
        },
        isLoginFormValid
      );
    } // switching to signup mode
    else {
      setFormDataCallback(
        {
          ...formState.inputs,
          // add name field
          name: {
            value: '',
            isValid: false,
          },
        },
        false // always false since we're adding a new input(name)
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
    // if you have multiple setState in the same synchronous code block,
    // React will batch them together in one render cycle to prevent unnecessary re-renders
  };

  return (
    <Card className="authentication">
      <h2 className="authentication__header">Login Required</h2>
      <hr />
      <form className={`authentication__form`} onSubmit={handleAuthSubmit}>
        {!isLoginMode && (
          <Input
            element="input"
            id="name"
            type="text"
            label="Your Name"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a name"
            inputChangeCallback={inputChangeCallback}
          />
        )}
        <Input
          element="input"
          id="email"
          type="email"
          label="Email"
          validators={[VALIDATOR_EMAIL()]}
          errorText="Please enter a valid email address"
          inputChangeCallback={inputChangeCallback}
        />
        <Input
          element="input"
          id="password"
          type="password"
          label="Password"
          validators={[VALIDATOR_MINLENGTH(6)]}
          errorText="Please enter a valid email address"
          inputChangeCallback={inputChangeCallback}
        />
        <Button type="submit" disabled={!formState.isValid}>
          {isLoginMode ? 'LOGIN' : 'SIGNUP'}
        </Button>
      </form>
      <Button inverse handleClick={switchMode}>
        SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
      </Button>
    </Card>
  );
};

export default Auth;
