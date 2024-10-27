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
import createLoanRequest from "./api/v1/handlers/loan/request/create.js";
import listLoans from "./api/v1/handlers/loan/list.js";
import selfApply from "./api/v1/handlers/loan/selfapply.js";
import listLoanRequests from "./api/v1/handlers/loan/request/list.js";
import processLoanRequest from "./api/v1/handlers/loan/request/process.js";
import userProfile from "./api/v1/handlers/profile/user.js";
import organizationProfile from "./api/v1/handlers/profile/organization.js";
import employeeProfile from "./api/v1/handlers/profile/employee.js";
import listSavingsAccounts from "./api/v1/handlers/account/savings/listSavingsAccounts.js";
import createSavingsAccount from "./api/v1/handlers/account/savings/createSavingsAccount.js";
import savingsAccountPlans from "./api/v1/handlers/account/savings/savingsAccountPlans.js";

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(compression());
app.use(express.json());

const api = new OpenAPIBackend({
  definition: v1ApiDoc,
  strict: true,
  handlers: {
    login,
    userProfile,
    organizationProfile,
    employeeProfile,
    listSavingsAccounts,
    createSavingsAccount,
    savingsAccountPlans,
    createLoanRequest,
    listLoans,
    listLoanRequests,
    processLoanRequest,
    selfApply,
    validationFail,
    notFound,
    methodNotAllowed,
    notImplemented,
    unauthorizedHandler,
  },
});
api.registerSecurityHandler("jwt", jwtHandler);
await api.init();
// @ts-expect-error - Request types are trivially incompatible
app.use("/api/v1", (req, res) => api.handleRequest(req, req, res));

app.use(
  (
    err: ExpressError,
    _req: express.Request,
    res: express.Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: express.NextFunction,
  ) => {
    res.status(err.status || 500);
    res.send(err.message);
  },
);

export default app;
