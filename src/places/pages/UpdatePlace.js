import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import { useForm } from '../../shared/hooks/form-hook';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from '../../shared/util/validators';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './PlaceForm.css';
import LoadingSpinner from 'shared/components/UIElements/LoadingSpinner';
import ErrorModal from 'shared/components/UIElements/ErrorModal';

// import './UpdatePlace.css';

const UpdatePlace = (props) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlace, setLoadedPlace] = useState();

  const placeId = useParams().placeId;
  const history = useHistory();

  const [formState, inputChangeCallback, setFormDataCallback] = useForm(
    {
      title: {
        value: '',
        isValid: false,
      },
      description: {
        value: '',
        isValid: false,
      },
    },
    true // initially true (validated before)
  );

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/places/${placeId}`
        );
        setLoadedPlace(responseData.place);
        setFormDataCallback({
          title: {
            value: responseData.place.title,
            isValid: true,
          },
          description: {
            value: responseData.place.description,
            isValid: true,
          },
        });
      } catch (err) {}
    };
    fetchPlace();
  }, [sendRequest, placeId, setFormDataCallback]);

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendRequest(
        `http://localhost:5000/api/places/${placeId}`,
        'PATCH',
        // You must stringify request body!!!
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
        {
          // need to set Content-Type for body-parser on backend
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token,
        }
      );
      // we want to redirect users to the user's places page
      // for that, we need to get userId from the context
      history.push(`/${auth.userId}/places`);
    } catch (err) {}
    console.log(formState.inputs);
  };
  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner asOverlay />
      </div>
    );
  }

  if (!loadedPlace && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Cannot find the place</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {/* Prevent useReducer from running after the form and rendered and therefore, overriding initial values with empty strings */}
      {/* We want this to be rendered AFTER formState is initialized */}
      {!isLoading && loadedPlace && (
        <form className={`place-form`} onSubmit={handleUpdateSubmit}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            inputChangeCallback={inputChangeCallback}
            // initialize value with the data from backend
            initialValue={loadedPlace.title}
            initialIsValid={true}
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (min. 5 characters)."
            inputChangeCallback={inputChangeCallback}
            initialValue={loadedPlace.description}
            initialIsValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE PLACE
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdatePlace;
