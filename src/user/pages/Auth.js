import React, { useState, useContext } from 'react';

import Card from '../../shared/components/UIElements/Card';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

import './Auth.css';

const Auth = (props) => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

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

  const handleAuthSubmit = async (e) => {
    e.preventDefault();

    console.log(formState.inputs);

    if (isLoginMode) {
      try {
        // React will immediately update the UI before sending request since we're inside async function

        // let's get the userId from the login/ signup responseData
        const responseData = await sendRequest(
          'http://localhost:5000/api/users/login',
          'POST',
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          { 'Content-Type': 'application/json' }
        );

        // server sends this response:
        // return res.status(201).json({ user: createdUser.toObject({ getters: true }) });
        // pass id info so that we can update userId in context
        auth.login(responseData.user.id); // we can access stringified _id at .id (getter)
      } catch (err) {
        console.log(err);
        // error is already handled inside useHttpClient hook
        // we just need catch to break out of the hook
      }
    } else {
      try {
        const responseData = await sendRequest(
          'http://localhost:5000/api/users/signup',
          'POST',
          JSON.stringify({
            // 'name' field is only available in signup mode
            name: formState.inputs.name.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            'Content-Type': 'application/json',
          }
        );
        // only continue to here if we don't have error
        auth.login(responseData.user.id);
      } catch (err) {
        // we're just catching the error thrown at the useHttpClient hook
        // which already handled error and throws to change execution flow
        console.log(err);
      }
    }
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
          image: undefined,
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
          image: {
            value: null,
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
  // replace handleError with clearError returned from useHttpClient

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
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
          {!isLoginMode && (
            <ImageUpload id="image" center onInput={inputChangeCallback} />
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
        <Button inverse onClick={switchMode}>
          SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
        </Button>
      </Card>
    </React.Fragment>
  );
};

export default Auth;
