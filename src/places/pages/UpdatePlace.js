import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useForm } from '../../shared/hooks/form-hook';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from '../../shared/util/validators';

import './PlaceForm.css';

const DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Youido Park',
    description: 'Beautiful park surrounded by sky scrapers in Youido, Seoul',
    imageUrl: 'https://placem.at/places?w=1260&h=750&random=1',
    address: '68 Yeouigongwon-ro, Yeoui-dong, Yeongdeungpo-gu, Seoul', // cspell: disable-line
    location: {
      lat: 37.524482,
      lng: 126.919066,
    },
    creator: 'u1',
  },
  {
    id: 'p2',
    title: ' Park',
    description: 'Beautiful park surrounded by sky scrapers in Youido, Seoul',
    imageUrl: 'https://placem.at/places?w=1260&h=750&random=2',
    address: '68 Yeouigongwon-ro, Yeoui-dong, Yeongdeungpo-gu, Seoul', // cspell: disable-line
    location: {
      lat: 37.524482,
      lng: 126.919066,
    },
    creator: 'u2',
  },
];

// import './UpdatePlace.css';

const UpdatePlace = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  // extract the dynamic param from url (path="/places/:placeId")
  const placeId = useParams().placeId;

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

  // Select place by id from params
  // (DUMMY_PLACES will be fetched from the server)
  const identifiedPlace = DUMMY_PLACES.find((p) => p.id === placeId);

  // We want to initialize our form data with the fetched data
  // which is passed down to the Input component as initial value
  // but this effect runs AFTER the Input components are rendered
  useEffect(() => {
    if (identifiedPlace) {
      // prevent undefined error when user deletes the last place
      setFormDataCallback({
        title: {
          value: identifiedPlace.title,
          isValid: true,
        },
        description: {
          value: identifiedPlace.description,
          isValid: true,
        },
      });
    }
    setIsLoading(false);
    // identifiedPlace doesn't change on rerender (as long as the placeId doesn't change)
    // because it points to the same place object inside DUMMY_PLACE
  }, [setFormDataCallback, identifiedPlace]);

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    console.log(formState.inputs);
  };

  if (!identifiedPlace) {
    return (
      <div className="center">
        <Card>
          <h2>Cannot find the place</h2>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="center">
        <h2>Loading...</h2>
      </div>
    );
  }
  return (
    // temporary workaround to delay rendering input until after the local state is populated
    // to prevent Input reducer initializing value too early with empty strings
    // (we'll replace with different logic when we fetch the real data.)
    !isLoading && (
      <form className={`place-form`} onSubmit={handleUpdateSubmit}>
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          inputChangeCallback={inputChangeCallback}
          initialValue={formState.inputs.title.value}
          initialIsValid={formState.inputs.title.isValid}
        />
        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (min. 5 characters)."
          inputChangeCallback={inputChangeCallback}
          initialValue={formState.inputs.description.value}
          initialIsValid={formState.inputs.description.isValid}
        />
        <Button type="submit" disabled={!formState.isValid}>
          UPDATE PLACE
        </Button>
      </form>
    )
  );
};

export default UpdatePlace;
