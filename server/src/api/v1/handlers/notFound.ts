import { Handler } from "openapi-backend";

const notFound: Handler = (_c, _req, res) =>
  res.status(404).json({ status: 404, err: ["Not found"] });

export default notFound;
