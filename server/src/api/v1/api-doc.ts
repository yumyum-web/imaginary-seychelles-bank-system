import { OpenAPIV3 } from "openapi-types";

const apiDoc: OpenAPIV3.Document = {
  openapi: "3.0.0",
  info: {
    title: "Backend API for the Imaginary Seychelles Bank web system.",
    version: "1.0.0",
  },
  paths: {
    "/auth/login": {
      post: {
        summary: "Login to the system",
        operationId: "login",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  username: {
                    type: "string",
                  },
                  password: {
                    type: "string",
                  },
                },
                required: ["username", "password"],
              },
            },
          },
        },
        security: [],
        responses: {
          200: {
            description: "Successful login",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    token: {
                      type: "string",
                    },
                    user: {
                      type: "object",
                      properties: {
                        levels: { type: "array", items: { type: "string" } },
                        customer: {
                          type: "object",
                          properties: {
                            id: { type: "number" },
                            type: { type: "string" },
                          },
                        },
                        employee: {
                          type: "object",
                          properties: { id: { type: "number" } },
                        },
                      },
                      required: ["levels"],
                      anyOf: [
                        { required: ["customer"] },
                        { required: ["employee"] },
                      ],
                      additionalProperties: false,
                    },
                  },
                  required: ["token", "user"],
                },
              },
            },
          },
          400: {
            $ref: "#/components/responses/ValidationFail",
          },
        },
      },
    },
  },
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
    securitySchemes: {
      jwt: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [
    {
      jwt: [],
    },
  ],
};

export default apiDoc;
