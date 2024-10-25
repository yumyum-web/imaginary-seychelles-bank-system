import { Handler } from "openapi-backend";

const methodNotAllowed: Handler = (_c, _req, res) => {
  return res.status(405).json({ status: 405, err: ["Method not allowed"] });
};

export default methodNotAllowed;
