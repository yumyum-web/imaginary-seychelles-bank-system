import jwt from "jsonwebtoken";
import { Handler } from "openapi-backend";

import { config } from "../../config.js";

const jwtHandler: Handler = (c) => {
  const authHeader = c.request.headers["authorization"];
  if (!authHeader) {
    throw new Error("Missing authorization header");
  }

  const token = authHeader.replace("Bearer ", "");
  return jwt.verify(token, config.jwtTokenSecret);
};

export default jwtHandler;
