import { Handler } from "openapi-backend";

const notImplementedHandler: Handler = (_c, _req, res) => {
  return res
    .status(404)
    .json({ status: 501, err: "No handler registered for operation" });
};

export default notImplementedHandler;
