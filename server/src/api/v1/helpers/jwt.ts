import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../../config.js";

class User {
  id: number;
  levels: string[];

  constructor(id: number, levels: string[]) {
    this.id = id;
    this.levels = levels;
  }
}

// constructs a User object from a JwtPayload, throws an error if the JwtPayload is invalid
function userFromJwtPayload(obj: JwtPayload | string): User {
  if (
    !obj ||
    typeof obj !== "object" ||
    typeof obj.user !== "object" ||
    typeof obj.user.id !== "number" ||
    !Array.isArray(obj.user.levels) ||
    !obj.user.levels.every((l: unknown) => typeof l === "string")
  ) {
    throw new Error("Invalid JWT payload");
  }
  return new User(obj.user.id, obj.user.levels);
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
