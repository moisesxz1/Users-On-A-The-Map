import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';

import Users from './components/Users';
import NewPlace from './components/NewPlace';
import UserPlaces from './components/UserPlaces';
import UpdatePlace from './components/UpdatePlace';
import Auth from './components/Auth';
import MainNavigation from './components/MainNavigation';
import { AuthContext } from './context/auth-context';
import { useAuth } from './hooks/auth-hook';


const App = () => {

  const { token, login, logout, userId } = useAuth();

  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact> <Users /> </Route>
        <Route path="/:userId/places" exact> <UserPlaces /> </Route>
        <Route path="/places/new" exact> <NewPlace /> </Route>
        <Route path="/places/:placeId" exact> <UpdatePlace /> </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact> <Users /> </Route>
        <Route path="/:userId/places" exact> <UserPlaces /> </Route>
        <Route path="/auth"> <Auth /> </Route>
        <Redirect to="/auth" />
      </Switch>
    )
  }

  return (
    <AuthContext.Provider value={{
      isLoggedIn: !!token,
      token: token,
      userId: userId,
      login: login,
      logout: logout
    }}
    >
      <Router>
        <MainNavigation />
        <main>
          {routes}
        </main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;

//useEffects always runs after the render cycle
