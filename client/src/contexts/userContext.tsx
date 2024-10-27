import React, { createContext, useState, useEffect, ReactNode } from "react";
import { User } from "./types";

interface UserContextType {
  user: User | null;
  userLevels: string[] | null;
  setUserLevels: (userLevel: string[]) => void;
  login: (userData: User) => void;
  logout: () => void;
}

// Create the context with an initial value
export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userLevels, setUserLevels] = useState<string[] | null>(null);

  // Temporary useEffect to set a test user
  useEffect(() => {
    setUser({ username: "test", type: "Employee", branch: "test" });
  }, []);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{ user, userLevels, setUserLevels, login, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};
