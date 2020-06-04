import { useState, useCallback, useRef, useEffect } from 'react';

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  // can store data across render cycles
  const activeHttpRequest = useRef([]);

  // prevents creating new function when the component using this callback re-renders
  //  ( effect using sendRequest sets state => rerender => new sendRequest => repeat )
  const sendRequest = useCallback(async (
    url,
    method = 'GET',
    body = null,
    // header's default value should be an empty object
    headers = {}
  ) => {
    setIsLoading(true);
    const httpAbortController = new AbortController();
    // we don't want to update UI when updating this data => useRef
    activeHttpRequest.current.push(httpAbortController);

    try {
      const response = await fetch(url, {
        method,
        body,
        headers,
        // link abort controller to this request so that we can cancel this request later
        signal: httpAbortController.signal,
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message);
      }

      return responseData;
    } catch (err) {
      setError(err);
    }
    setIsLoading(false);
  }, []);

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    // this cleanup fn runs before the useEffect in next render runs
    // or when the component unmounts
    return () => {
      /*
      WARNING on activeHttpRequest.current
      The ref value 'activeHttpRequest.current' will likely have changed 
      by the time this effect cleanup function runs. If this ref points 
      to a node rendered by React, copy 'activeHttpRequest.current' 
      to a variable inside the effect, and use that variable in 
      the cleanup function.    eslint(react-hooks/exhaustive-deps)
      */
      // We can ignore this warning because we do want to go through all the controllers
      // we registered up to this point.
      activeHttpRequest.current.forEach((abortController) =>
        // cancel all ongoing request when this component unmounts
        abortController.abort()
      );
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};
