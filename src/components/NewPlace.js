import React, { useContext, Fragment } from 'react';
import { useHistory } from 'react-router-dom';

import Input from './Input';
import Button from './Button';
import ErrorModal from './ErrorModal';
import LoadingSpinner from './LoadingSpinner';
import ImageUpload from './ImageUpload';

import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../util/validators';
import { useForm } from '../hooks/form-hook';
import { useHttpClient } from '../hooks/http-hook';
import { AuthContext } from '../context/auth-context';
import '../Styling/PlaceForm.css';



const NewPlace = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm({
    title: {
      value: '',
      isValid: false
    },
    description: {
      value: '',
      isValid: false
    },
    address: {
      value: '',
      isValid: false
    },
    image: {
      value: null,
      isValid: false
    }
  }, false
  )

  const history = useHistory();

  const placeSubmitHandler = async event => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append('title', formState.inputs.title.value);
      formData.append('description', formState.inputs.description.value);
      formData.append('address', formState.inputs.address.value);
      formData.append('image', formState.inputs.image.value)
      await sendRequest(
        'http://localhost:5000/api/places',
        'POST',
        formData,
        {
          Authorization: 'Bearer ' + auth.token
        }
      );

      history.push('/');
    } catch (err) {

    }
  };

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form" onSubmit={placeSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          errorText="Please enter a valid title."
          validators={[VALIDATOR_REQUIRE()]}
          onInput={inputHandler} />
        <Input
          id="description"
          element="textarea"
          label="Title"
          errorText="Please enter a valid description(at least 5 characters)."
          validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5)]}
          onInput={inputHandler}
        />

        <Input
          id="address"
          element="input"
          label="Address"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid address"
          onInput={inputHandler}
        />
        <ImageUpload id="image" onInput={inputHandler} errorText="Please provide an image" />
        <Button type="submit" disabled={!formState.isValid}>
          ADD PLACE
    </Button>
      </form>;
  </Fragment>
  )
};

export default NewPlace;

//useCallback wraps a function and defines dependencies of the function under wich it should re-render