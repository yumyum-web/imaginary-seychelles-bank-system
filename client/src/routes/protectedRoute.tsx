// ProtectedRoute.tsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "@/contexts/useUser";

interface ProtectedRouteProps {
  requiredLevels: string[];
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requiredLevels,
  children,
}) => {
  const { userLevels } = useUser();
  const location = useLocation();

  if (!userLevels) {
    // User is not authenticated
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  const hasRequiredLevel = requiredLevels.some((level) =>
    userLevels.includes(level),
  );

  if (!hasRequiredLevel) {
    // User does not have the required access level
    return <Navigate to="/401" replace />;
  }

  return children;
};

export default ProtectedRoute;
