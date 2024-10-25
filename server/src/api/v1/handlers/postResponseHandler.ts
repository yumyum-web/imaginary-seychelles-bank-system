import { Handler } from "openapi-backend";

const postResponseHandler: Handler = (c, _req, res) => {
  if (c.operation) {
    const valid = c.api.validateResponse(c.response, c.operation);
    if (valid.errors) {
      return res.status(502).json({ status: 502, err: valid.errors });
    }
  }
  return res.status(200).send();
};

export default postResponseHandler;
