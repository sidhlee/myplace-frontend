import { createContext } from 'react';

export const AuthContext = createContext({
  isLoggedIn: false,
  // we can manage userId here once a user is logged in
  userId: null,
  token: null, // not really need the initial value, but good for auto-completion
  login: () => {},
  logout: () => {},
});
