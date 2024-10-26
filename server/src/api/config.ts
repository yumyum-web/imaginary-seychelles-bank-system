import "dotenv/config";

const requiredEnvVar = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable ${name}`);
  }
  return value;
};

const optionalEnvVar = (name: string, defaultValue: string): string => {
  return process.env[name] || defaultValue;
};

export const config = {
  dbHost: requiredEnvVar("DB_HOST"),
  dbPort: parseInt(optionalEnvVar("DB_PORT", "3306")),
  dbUser: requiredEnvVar("DB_USER"),
  dbPassword: requiredEnvVar("DB_PASSWORD"),
  dbName: requiredEnvVar("DB_NAME"),
  jwtTokenSecret: requiredEnvVar("JWT_TOKEN_SECRET"),
  jwtTokenExpiresIn: optionalEnvVar("JWT_TOKEN_EXPIRES_IN", "1h"),
};
