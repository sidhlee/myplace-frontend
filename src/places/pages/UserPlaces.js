import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useHttpClient } from 'shared/hooks/http-hook';

import PlaceList from '../components/PlaceList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

const UserPlaces = (props) => {
  const [loadedPlaces, setLoadedPlaces] = useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const userId = useParams().userId;

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/places/user/${userId}`
        );

        /*
          The backend sends this response:
          return res.json({
            places: userWithPlaces.places.map((place) =>
            place.toObject({ getters: true })
            ),
          });
        */
        setLoadedPlaces(responseData.places);
      } catch (err) {}
    };
    fetchPlaces();
    // userId won't change as long as we're on the same page with the same logged in user
  }, [sendRequest, userId]);

  /**
   * Update UI when place is deleted
   * @param {string} deletedPlaceId
   */
  const handlePlaceDelete = (deletedPlaceId) => {
    setLoadedPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place.id !== deletedPlaceId)
    );
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      )}
      {!isLoading && loadedPlaces && (
        <PlaceList items={loadedPlaces} onDeletePlace={handlePlaceDelete} />
      )}
    </React.Fragment>
  );
};

export default UserPlaces;
