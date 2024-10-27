import { useContext } from "react";
import { UserContext } from "./userContext"; // adjust path as necessary

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
