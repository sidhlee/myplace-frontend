import React, { useState } from 'react';

import Card from '../../shared/components/UIElements/Card';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';

import './Auth.css';

const Auth = (props) => {
  const [formState, inputChangeCallback] = useForm(
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
  };

  return (
    <Card className="authentication">
      <h2 className="authentication__header">Login Required</h2>
      <hr />
      <form className={`authentication__form`} onSubmit={handleAuthSubmit}>
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
          LOGIN
        </Button>
      </form>
    </Card>
  );
};

export default Auth;
