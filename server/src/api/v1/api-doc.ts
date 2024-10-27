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
                          properties: {
                            id: { type: "number" },
                            branchId: { type: "number" },
                          },
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
    "/account/savings/list": {
      get: {
        summary:
          "List savings accounts of a customer. Employees can list any customer's accounts. Customers can only list their own accounts.",
        operationId: "listSavingsAccounts",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  customerId: {
                    type: "number",
                  },
                },
              },
            },
          },
        },
        security: [
          {
            jwt: ["customer", "employee"],
          },
        ],
        responses: {
          200: {
            description: "Successful operation",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/SavingsAccount",
                  },
                },
              },
            },
          },
          400: {
            $ref: "#/components/responses/ValidationFail",
          },
          401: {
            $ref: "#/components/responses/Unauthorized",
          },
        },
      },
    },
  },
  components: {
    responses: {
      Forbidden: {
        description: "403 Forbidden",
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
      SavingsAccount: {
        type: "object",
        properties: {
          id: { type: "integer" },
          balance: { type: "string", maxLength: 10 },
          noOfWithdrawals: { type: "integer" },
          planId: { type: "integer" },
          planName: { type: "string", maxLength: 30 },
          branchId: { type: "integer" },
          branchName: { type: "string" },
        },
        required: [
          "id",
          "balance",
          "noOfWithdrawals",
          "planId",
          "planName",
          "branchId",
          "branchName",
        ],
      },
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
