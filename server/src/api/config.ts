import "dotenv/config";

export const config = {
  jwtTokenSecret: (() => {
    const secret = process.env.JWT_TOKEN_SECRET;
    if (!secret) {
      throw new Error("Missing JWT token secret");
    }
    return secret;
  })(),
  jwtTokenExpiresIn: process.env.JWT_TOKEN_EXPIRES_IN || "1h",
};
