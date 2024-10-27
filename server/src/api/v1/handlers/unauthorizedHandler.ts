import { Handler } from "openapi-backend";

const unauthorizedHandler: Handler = (_c, _req, res) => {
  return res.status(401).json({ status: 401, err: "Authenticate first" });
};

export default unauthorizedHandler;
