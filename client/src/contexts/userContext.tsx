import React, { createContext, useState, useEffect, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Individual, Organization, Employee } from "./types";

interface UserContextType {
  user: Individual | Organization | Employee | null;
  setUser: (user: Individual | Organization | Employee) => void;
  token: string | null;
  setToken: (token: string) => void;
  userLevels: string[] | null;
  setUserLevels: (userLevel: string[]) => void;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<Individual | Organization | Employee | null>(
    null,
  );
  const [token, setToken] = useState<string | null>(null);
  const [userLevels, setUserLevels] = useState<string[] | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  //initially get the token and user levels from the session storage
  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    const storedUserLevels = sessionStorage.getItem("userLevels");
    if (storedToken && storedUserLevels) {
      setToken(storedToken);
      setUserLevels(JSON.parse(storedUserLevels));
    }
  }, []);

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
    } else if (
      userLevels.includes("user") &&
      !location.pathname.startsWith("/user")
    ) {
      navigate("/user");
    }
  }, [userLevels, navigate, location.pathname]);

  return (
    <UserContext.Provider
      value={{ user, setUser, token, setToken, userLevels, setUserLevels }}
    >
      {children}
    </UserContext.Provider>
  );
};
