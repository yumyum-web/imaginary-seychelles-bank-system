import { Handler } from "openapi-backend";

const validationFail: Handler = (c, _req, res) =>
  res.status(400).json({ status: 400, err: c.validation.errors });

export default validationFail;
