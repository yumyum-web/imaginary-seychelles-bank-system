import { OpenAPIV3 } from "openapi-types";

const apiDoc: OpenAPIV3.Document = {
  openapi: "3.0.0",
  info: {
    title: "Backend API for the Imaginary Seychelles Bank web system.",
    version: "1.0.0",
  },
  paths: {},
  components: {
    responses: {
      Unauthorized: {
        description: "401 Unauthorized",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                status: {
                  type: "integer",
                },
                err: {
                  type: "string",
                },
              },
              required: ["status", "err"],
            },
          },
        },
      },
      ValidationFail: {
        description: "400 Validation failed",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                status: {
                  type: "integer",
                },
                err: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/ValidationError",
                  },
                  nullable: true,
                },
              },
              required: ["status", "err"],
            },
          },
        },
      },
    },
    schemas: {
      ValidationError: {
        type: "object",
        properties: {
          keyword: {
            type: "string",
          },
          params: {
            type: "object",
          },
          message: {
            type: "string",
          },
        },
        additionalProperties: true,
        required: ["keyword", "params"],
      },
    },
  },
};

export default apiDoc;
