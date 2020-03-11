import { useState, useCallback, useRef, useEffect } from 'react';

export const useHttpClient = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const activeHttpRequests = useRef([]); // stores data across re-render cycles

    const sendRequest = useCallback(async (url, method = 'GET', body = null, headers = {}) => {

        setIsLoading(true);

        const httpAbortCtrl = new AbortController();
        activeHttpRequests.current.push(httpAbortCtrl); // dont updathe the UI when this data changes
        try {
            const response = await fetch(url, {
                method,
                body,
                headers,
                signal: httpAbortCtrl.signal
            });

            const responseData = await response.json();

            activeHttpRequests.current = activeHttpRequests.current.filter(reqCtrl => reqCtrl !== httpAbortCtrl); //remove the request controller wich was used for the request

            if (!response.ok) {
                throw new Error(responseData.message);
            }

            setIsLoading(false);
            return responseData;

        } catch (err) {
            setError(err.message);
            setIsLoading(false);
            throw err;
        }
    },
        []
    );

    const clearError = () => {
        setError(null);
    }

    useEffect(() => {
        return () => {
            activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort()); // the request to wich it is linked will be aborted
        };
    }, []);

    return { isLoading, error, sendRequest, clearError };
};


///AbortController : is a functionality built into modern browsers
//signal: links the AbortController to the request
//useEffect: when a function is returned then the returned function is executed as a cleanup function before the next time useEffect runs again or also when the component that uses useEffect unmounts
//The logics implies to make sure that we never continue with a request that is on its way out  if we then switch away from  the component that triggered that request