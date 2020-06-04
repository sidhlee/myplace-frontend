import { createContext } from 'react';

export const AuthContext = createContext({
  isLoggedIn: false,
  // we can manage userId here once a user is logged in
  userId: null,
  login: () => {},
  logout: () => {},
});
