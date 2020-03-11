import React, { useEffect, useState, Fragment } from 'react';
import { useParams } from 'react-router-dom';

import PlaceList from './PlaceList';
import ErrorModal from './ErrorModal';
import LoadingSpinner from './LoadingSpinner';
import { useHttpClient } from '../hooks/http-hook';




const UserPlaces = () => {
    const [loadedPlaces, setLoadedPlaces] = useState();
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const userId = useParams().userId;

    useEffect(() => {
        const fetchPlaces = async () => {
            try {

                const responseData = await sendRequest(`http://localhost:5000/api/places/user/${userId}`);
                setLoadedPlaces(responseData.places);
            } catch (err) {

            };
        }
        fetchPlaces();
    }, [sendRequest, userId]);

    //Update the UI Whenever a place its deleted.
    const placeDeletedHandler = deletedPlaceId => {
        setLoadedPlaces(prevPlaces => prevPlaces.filter(p => p.id !== deletedPlaceId))
    }

    return (
        <Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && (
                <div className="center">
                    <LoadingSpinner />
                </div>
            )}
            {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} onDeletePlace={placeDeletedHandler} />}
        </Fragment>
    )
}

export default UserPlaces;