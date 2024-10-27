import express from "express";
import { OpenAPIBackend } from "openapi-backend";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";

import v1ApiDoc from "./api/v1/api-doc.js";
import { ExpressError } from "./api/v1/errors.js";
import validationFail from "./api/v1/handlers/validationFail.js";
import notFound from "./api/v1/handlers/notFound.js";
import methodNotAllowed from "./api/v1/handlers/methodNotAllowed.js";
import notImplemented from "./api/v1/handlers/notImplemented.js";
import unauthorizedHandler from "./api/v1/handlers/unauthorizedHandler.js";
import jwtHandler from "./api/v1/securityHandlers/jwtHandler.js";
import login from "./api/v1/handlers/auth/login.js";
import profileRoutes from './routes/profileRoutes.js'; // Import the profile routes
import organizationRoutes from './routes/organizationRoutes.js'; // Import organization routes
import employeeRoutes from './routes/employeeRoutes.js'; // Import employee routes

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(compression());
app.use(express.json());

// Use the profile routes
app.use("/api/v1", profileRoutes); // Adjust the prefix as necessary

// Use the organization routes
app.use("/api/v1", organizationRoutes); // Adjust the prefix as necessary

// Use the employee routes
app.use("/api/v1", employeeRoutes); // Adjust the prefix as necessary

const api = new OpenAPIBackend({
  definition: v1ApiDoc,
  strict: true,
  handlers: {
    login,
    validationFail,
    notFound,
    methodNotAllowed,
    notImplemented,
    unauthorizedHandler,
  },
});
api.registerSecurityHandler("jwt", jwtHandler);
await api.init();

// Use the profile routes
app.use("/api/v1", profileRoutes); // Adjust the prefix as necessary

app.use(
  (
    err: ExpressError,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    res.status(err.status || 500);
    res.send(err.message);
  },
);

export default app;