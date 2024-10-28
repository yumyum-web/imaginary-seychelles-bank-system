import React, { createContext, useState, useEffect, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Individual, Organization, Employee } from "./types";
import {
  getEmployeeProfile,
  getUserProfile,
  getOrganizationProfile,
} from "@/api/profiles";

interface UserContextType {
  user: Individual | Organization | Employee | null;
  setUser: (user: Individual | Organization | Employee) => void;
  token: string | null;
  setToken: (token: string) => void;
  userLevels: string[] | null;
  setUserLevels: (userLevel: string[]) => void;
  userType: string | null;
  setUserType: (userType: string) => void;
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
  const [userType, setUserType] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    const storedUserLevels = sessionStorage.getItem("userLevels");
    const storedUserType = sessionStorage.getItem("userType");
    if (storedToken && storedUserLevels) {
      setToken(storedToken);
      setUserLevels(JSON.parse(storedUserLevels));
      setUserType(storedUserType);
    }
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (userLevels === null) return; // Ensure it only runs after userLevels are loaded

      if (userLevels.includes("manager")) {
        setUser(await getEmployeeProfile());
      } else if (userLevels.includes("employee")) {
        setUser(await getEmployeeProfile());
      } else if (userLevels.includes("user") && userType == "Individual") {
        setUser(await getUserProfile());
      } else if (userLevels.includes("user") && userType == "Orgnization") {
        setUser(await getOrganizationProfile());
      }
    };

    fetchUserProfile();
  }, [userLevels, userType]);

  useEffect(() => {
    if (userLevels === null) return; // Ensure it only runs after userLevels are loaded

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
      value={{
        user,
        setUser,
        token,
        setToken,
        userLevels,
        setUserLevels,
        userType,
        setUserType,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
