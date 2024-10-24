import express from "express";
import { initialize } from "express-openapi";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";

import v1ApiDoc from "./api/v1/api-doc.js";
import { joinPaths, makeDirIfNotExists } from "./utils.js";
import { paths } from "./config.js";
import { ExpressError } from "./api/v1/errors.js";

const pathsDir = joinPaths(paths.srcDir, "api", "v1", "paths");
makeDirIfNotExists(pathsDir);

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(compression());

await initialize({
  app,
  apiDoc: v1ApiDoc,
  dependencies: {},
  paths: pathsDir,
});

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
