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
    "/loan/selfapply": {
      // New Endpoint
      post: {
        summary: "Self-apply for a loan",
        operationId: "selfapply",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  customerId: {
                    type: "integer",
                  },
                  FDId: {
                    type: "integer",
                  },
                  savingsAccId: {
                    type: "integer",
                  },
                  loanType: {
                    type: "string",
                    enum: ["Business", "Personal"],
                  },
                  amount: {
                    type: "number",
                    format: "float",
                  },
                  purpose: {
                    type: "string",
                  },
                  timePeriod: {
                    type: "integer",
                  },
                },
                required: [
                  "customerId",
                  "FDId",
                  "savingsAccId",
                  "loanType",
                  "amount",
                  "purpose",
                  "timePeriod",
                ],
              },
            },
          },
        },
        responses: {
          201: {
            description: "Loan application successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                    },
                  },
                  required: ["message"],
                },
              },
            },
          },
          400: {
            $ref: "#/components/responses/ValidationFail",
          },
          500: {
            description: "Failed to apply for loan",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                    },
                  },
                  required: ["message"],
                },
              },
            },
          },
        },
      },
    },

    "/loan/create": {
      // New Endpoint
      post: {
        summary: "Create a loan request",
        operationId: "create",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  employeeId: {
                    type: "integer",
                  },
                  loanType: {
                    type: "string",
                    enum: ["Business", "Personal"],
                  },
                  loanAmount: {
                    type: "number",
                    format: "float",
                  },
                  purpose: {
                    type: "string",
                  },
                  accountId: {
                    type: "integer",
                  },
                  timePeriod: {
                    type: "integer",
                  },
                },
                required: [
                  "employeeId",
                  "loanType",
                  "loanAmount",
                  "purpose",
                  "accountId",
                  "timePeriod",
                ],
              },
            },
          },
        },
        responses: {
          201: {
            description: "Loan request created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                    },
                    loanType: {
                      type: "string",
                    },
                    amount: {
                      type: "number",
                      format: "float",
                    },
                    purpose: {
                      type: "string",
                    },
                    status: {
                      type: "string",
                    },
                    timePeriod: {
                      type: "integer",
                    },
                  },
                  required: [
                    "message",
                    "loanType",
                    "amount",
                    "purpose",
                    "status",
                    "timePeriod",
                  ],
                },
              },
            },
          },
          400: {
            $ref: "#/components/responses/ValidationFail",
          },
          500: {
            description: "Failed to create loan request",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                    },
                  },
                  required: ["message"],
                },
              },
            },
          },
        },
      },
    },
    "/loan/process": {
      // New endpoint for accepting or rejecting a loan request
      post: {
        summary: "Accept or reject a loan request",
        operationId: "process",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  managerId: {
                    type: "integer",
                  },
                  requestId: {
                    type: "integer",
                  },
                  action: {
                    type: "string",
                    enum: ["Accept", "Reject"], // Valid values for action
                  },
                },
                required: ["managerId", "requestId", "action"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Loan request processed successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                    },
                    requestId: {
                      type: "integer",
                    },
                    action: {
                      type: "string",
                    },
                  },
                  required: ["message", "requestId", "action"],
                },
              },
            },
          },
          400: {
            $ref: "#/components/responses/ValidationFail",
          },
          500: {
            description: "Failed to process loan request",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                    },
                  },
                  required: ["message"],
                },
              },
            },
          },
        },
      },
    },
    "/loan/details": {
      get: {
        summary: "Retrieve loan details for a customer",
        operationId: "details",
        parameters: [
          {
            name: "loanId",
            in: "query",
            required: true,
            schema: {
              type: "integer",
            },
            description: "The unique ID of the loan",
          },
          {
            name: "customerId",
            in: "query",
            required: true,
            schema: {
              type: "integer",
            },
            description: "The unique ID of the customer",
          },
        ],
        responses: {
          200: {
            description: "Loan details retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    loanId: { type: "integer" },
                    loanType: { type: "string" },
                    amount: { type: "number", format: "float" },
                    purpose: { type: "string" },
                    interestRate: { type: "number", format: "float" },
                    startDate: { type: "string" },
                    endDate: { type: "string" },
                    status: { type: "string" },
                    timePeriod: { type: "integer" },
                  },
                  required: [
                    "loanId",
                    "loanType",
                    "amount",
                    "purpose",
                    "interestRate",
                    "startDate",
                    "endDate",
                    "status",
                    "timePeriod",
                  ],
                },
              },
            },
          },
          404: {
            description: "Loan not found or unauthorized access",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                  },
                  required: ["message"],
                },
              },
            },
          },
          500: {
            description: "Failed to retrieve loan details",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                  },
                  required: ["message"],
                },
              },
            },
          },
        },
      },
    },
    "/loan/list": {
      get: {
        summary: "Get all loan requests",
        operationId: "list",
        responses: {
          200: {
            description: "Successful retrieval of loan requests",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      requestId: {
                        type: "number",
                      },
                      employeeId: {
                        type: "number",
                      },
                      loanType: {
                        type: "string",
                        enum: ["Business", "Personal"],
                      },
                      loanAmount: {
                        type: "number",
                        format: "float",
                      },
                      purpose: {
                        type: "string",
                      },
                      status: {
                        type: "string",
                        enum: ["Pending", "Approved", "Rejected"],
                      },
                      timePeriod: {
                        type: "number",
                      },
                      createdAt: {
                        type: "string",
                      },
                    },
                    required: [
                      "requestId",
                      "employeeId",
                      "loanType",
                      "loanAmount",
                      "purpose",
                      "status",
                      "timePeriod",
                      "createdAt",
                    ],
                  },
                },
              },
            },
          },
          404: {
            description: "No loan requests found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                    },
                  },
                  required: ["message"],
                },
              },
            },
          },
          500: {
            description: "Failed to retrieve loan requests",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                    },
                  },
                  required: ["message"],
                },
              },
            },
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
