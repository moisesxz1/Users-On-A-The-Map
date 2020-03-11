import React, { useEffect, useState, Fragment } from 'react';

import UsersList from './UsersList';
import ErrorModal from './ErrorModal';
import LoadingSpinner from './LoadingSpinner';
import { useHttpClient } from '../hooks/http-hook';

const Users = () => {
   const { isLoading, error, sendRequest, clearError} = useHttpClient();    
    const [loadedUsers, setLoadedUsers] = useState();

    useEffect(() => {
        const fetchUsers = async () => {
         
            try {

                const responseData = await sendRequest('http://localhost:5000/api/users');
                
                setLoadedUsers(responseData.users);

            } catch (err) {
                
            }

            
        };
        fetchUsers();
    }, [sendRequest]);

 

    return (<Fragment>
        <ErrorModal error={error} onClear={clearError} />
        {isLoading && (
            <div className="center">
                <LoadingSpinner />
            </div>
        )}
        {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
    </Fragment>
    )
}

export default Users;

//the return method(36) executes before the useEffect