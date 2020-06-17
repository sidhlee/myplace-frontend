import React, { useState, useCallback, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';
import Users from './user/pages/Users';
import NewPlace from './places/pages/NewPlace';
import UserPlaces from './places/pages/UserPlaces';
import UpdatePlace from './places/pages/UpdatePlace';
import Auth from './user/pages/Auth';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import { AuthContext } from './shared/context/auth-context';

// timeout id
// We want to keep this data after re-rendering the App component
let logoutTimer;

const App = () => {
  const [token, setToken] = useState(null);
  // store expiration date as state
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [userId, setUserId] = useState(null);

  // useCallback to prevent infinite loop from consuming component that runs login function
  // 1. consuming component runs login in effect
  // 2. App's isLoggedIn local state changes
  // 3. App re-renders => new login function created
  // 4. consuming component runs login in effect
  const login = useCallback((uid, token, expirationDate) => {
    // store token and userId in state
    setToken(token); // The server sends token in the responseData when authenticated
    setUserId(uid);
    // this is not the App state but the local variable
    const tokenExpirationDate =
      // token is set to expire in 1h on backend
      // auto-logged in with useEffect(old expiration date) || logged in through the login form (new)
      expirationDate || new Date(new Date().getTime() + 3600 * 1000);
    // set expiration date in the state
    // triggers logout timer in useEffect
    setTokenExpirationDate(tokenExpirationDate);

    localStorage.setItem(
      'userData',
      JSON.stringify({
        userId: uid,
        token: token,
        // overwrite expiration with currently set expiration
        // toISOString() - ensure that no date info is lost when stringified
        expiration: tokenExpirationDate.toISOString(),
      })
    );
  }, []);

  const logout = useCallback(() => {
    // clear token & userId from state
    setToken(null);
    setUserId(null);
    // clear expirationDate
    // manual login updates tokenExpirationDate with existing state
    // and auto-logout will run with negative remaining time
    setTokenExpirationDate(null);
    // clear userData from localStorage - Ensure that users stay logged out after page reload
    localStorage.removeItem('userData');
  }, []);

  // Auto-logout effect
  // When tokenExpirationDate is updated inside login() through auto-login | login form,
  // logout after remaining time if token and tokenExpirationDate exist.
  useEffect(() => {
    if (token && tokenExpirationDate) {
      // we need to set the duration of timeout
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      // If token or tokenExpirationDate don't exist, clear timeout.
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  // Auto-login effect
  // This will run when App component is mounted (initial load & page reload)
  useEffect(() => {
    // storedDate.expiration is stringified.
    const storedData = JSON.parse(localStorage.getItem('userData'));

    if (
      storedData && // If 'userData' exists in localStorage (= logged in )
      storedData.token && // if token is still available
      new Date() < new Date(storedData.expiration) // check for expiration
    ) {
      login(
        storedData.userId,
        storedData.token,
        // login with previously set expiration
        new Date(storedData.expiration)
      );
    }
  }, [login]); // login never changes (useCallback) => only runs on mount
  let routes;

  if (token) {
    // you have to nest each set of routes inside Switch
    // if you use Fragment to wrap routes here and then pass it into the Switch,
    // Switch does not work (bug?)
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/places/new" exact>
          <NewPlace />
        </Route>
        {/* path with params must come after paths that share the same path name*/}
        <Route path="/places/:placeId">
          <UpdatePlace />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/auth">
          <Auth />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token, // quick convenience property to check login state
        token, // we'll need this token when making request to certain routes
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
