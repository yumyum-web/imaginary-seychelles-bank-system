import { Handler } from "openapi-backend";

import { decodeJwt } from "../helpers/jwt.js";
import { isLevelSufficientForSecurityRequirements } from "../helpers/accessHierarchy.js";

const jwtHandler: Handler = (c) => {
  const authHeader = c.request.headers["authorization"];
  if (!authHeader) {
    throw new Error("Missing authorization header");
  }

  const token = authHeader.replace("Bearer ", "");
  const user = decodeJwt(token);
  if (
    !user.levels.some((l) =>
      isLevelSufficientForSecurityRequirements(l, c.operation.security),
    )
  ) {
    throw new Error("Insufficient access level");
  }

  return user;
};

export default jwtHandler;
