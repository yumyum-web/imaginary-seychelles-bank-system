import React, { createContext, useState, useEffect, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { User } from "./types";

interface UserContextType {
  user: User | null;
  userLevels: string[] | null;
  setUserLevels: (userLevel: string[]) => void;
  login: (userData: User) => void;
  logout: () => void;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userLevels, setUserLevels] = useState<string[] | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Redirect based on user level if the user is on a different path
    if (!userLevels) {
      navigate("/sign-in");
    } else if (
      userLevels.includes("manager") &&
      !location.pathname.startsWith("/manager")
    ) {
      navigate("/manager");
    } else if (
      userLevels.includes("employee") &&
      !location.pathname.startsWith("/employee")
    ) {
      navigate("/employee");
    }
  }, [userLevels, navigate, location.pathname]);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    setUserLevels(null);
    navigate("/sign-in");
  };

  return (
    <UserContext.Provider
      value={{ user, userLevels, setUserLevels, login, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};
