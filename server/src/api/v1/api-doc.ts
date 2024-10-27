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
    "/loan/selfApply": {
      post: {
        summary: "Self-apply for a loan",
        operationId: "selfApply",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  FDId: {
                    type: "integer",
                  },
                  savingsAccountId: {
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
                  "FDId",
                  "savingsAccountId",
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
    "/loan/request/create": {
      post: {
        summary: "Create a loan request",
        operationId: "createLoanRequest",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
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
        security: [
          {
            jwt: ["employee"],
          },
        ],
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
    "/loan/request/process": {
      post: {
        summary: "Accept or reject a loan request",
        operationId: "processLoanRequest",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  requestId: {
                    type: "integer",
                  },
                  action: {
                    type: "string",
                    enum: ["Accept", "Reject"],
                  },
                },
                required: ["requestId", "action"],
              },
            },
          },
        },
        security: [
          {
            jwt: ["manager"],
          },
        ],
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
    "/loan/list": {
      get: {
        summary: "Retrieve loan list for the customer.",
        operationId: "listLoans",
        security: [
          {
            jwt: ["customer"],
          },
        ],
        responses: {
          200: {
            description: "Loan list retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Loan",
                  },
                },
              },
            },
          },
          500: {
            description: "Failed to retrieve loan list",
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
    "/loan/request/list": {
      get: {
        summary: "Get customer loan requests or branch loan requests",
        operationId: "listLoanRequests",
        security: [
          {
            jwt: ["customer", "manager"],
          },
        ],
        responses: {
          200: {
            description: "Successful retrieval of loan requests",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/LoanRequest",
                  },
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
      Loan: {
        type: "object",
        properties: {
          loanId: { type: "integer" },
          loanType: { type: "string" },
          amount: { type: "number", format: "float" },
          interestRate: { type: "number", format: "float" },
          purpose: { type: "string" },
          requestId: { type: "integer" },
          startDate: { type: "string" },
          endDate: { type: "string" },
        },
        required: [
          "loanId",
          "loanType",
          "amount",
          "interestRate",
          "purpose",
          "startDate",
          "endDate",
        ],
      },
      LoanRequest: {
        type: "object",
        properties: {
          id: {
            type: "number",
          },
          employeeId: {
            type: "number",
          },
          customerId: {
            type: "number",
          },
          type: {
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
          status: {
            type: "string",
            enum: ["Pending", "Approved", "Rejected"],
          },
          timePeriod: {
            type: "number",
          },
        },
        required: [
          "requestId",
          "employeeId",
          "customerId",
          "loanType",
          "loanAmount",
          "purpose",
          "status",
          "timePeriod",
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
