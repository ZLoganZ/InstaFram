import { createContext, useState } from 'react';

import { authService } from '@/services/AuthService';
import { HEADER, defaultUser } from '@/lib/constants';
import { AuthContextType } from '@/types';

const getCurrentUser = async () => {
  try {
    if (!localStorage.getItem(HEADER.ACCESSTOKEN)) return defaultUser;

    const { data } = await authService.getCurrentUser();

    return data.metadata;
  } catch (err) {
    return defaultUser;
  }
};

const initialState: AuthContextType = {
  currentUser: await getCurrentUser(),
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {}
};

export const AuthContext = createContext<AuthContextType>(initialState);

interface IAuthProvider {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: IAuthProvider) => {
  const [currentUser, setUser] = useState(initialState.currentUser);
  const [isAuthenticated, setIsAuthenticated] = useState(currentUser._id !== '');

  const value = {
    currentUser,
    isAuthenticated,
    setUser,
    setIsAuthenticated
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
