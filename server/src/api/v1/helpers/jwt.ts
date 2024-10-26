import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../../config.js";
import { User, validateUser } from "../models/User.js";

// constructs a User object from a JwtPayload, throws an error if the JwtPayload is invalid
function userFromJwtPayload(obj: JwtPayload | string): User {
  if (!obj || typeof obj !== "object" || typeof obj.user !== "object") {
    throw new Error("Invalid JWT payload");
  }
  if (!validateUser(obj.user)) {
    console.log(validateUser.errors);
    throw new Error("Invalid JWT payload");
  }
  return obj.user as unknown as User;
}

function decodeJwt(token: string) {
  return userFromJwtPayload(jwt.verify(token, config.jwtTokenSecret));
}

function encodeJwt(user: User) {
  return jwt.sign({ user }, config.jwtTokenSecret, {
    expiresIn: config.jwtTokenExpiresIn,
  });
}

export { decodeJwt, encodeJwt, User };
