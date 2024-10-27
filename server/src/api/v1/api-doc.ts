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
    "/profile/user": {
      get: {
        summary: "Get user profile",
        operationId: "userProfile",
        security: [
          {
            jwt: ["user"],
          },
        ],
        responses: {
          200: {
            description: "User profile retrieved successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
              },
            },
          },
          500: {
            description: "Failed to retrieve user profile",
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
    "/profile/organization": {
      get: {
        summary: "Get organization profile",
        operationId: "organizationProfile",
        security: [
          {
            jwt: ["organization"],
          },
        ],
        responses: {
          200: {
            description: "Organization profile retrieved successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Organization" },
              },
            },
          },
          500: {
            description: "Failed to retrieve organization profile",
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
    "/profile/employee": {
      get: {
        summary: "Get employee profile",
        operationId: "employeeProfile",
        security: [
          {
            jwt: ["employee"],
          },
        ],
        responses: {
          200: {
            description: "Employee profile retrieved successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Employee" },
              },
            },
          },
          500: {
            description: "Failed to retrieve employee profile",
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
        security: [
          {
            jwt: ["customer"],
          },
        ],
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
      Employee: {
        type: "object",
        properties: {
          id: { type: "number" },
          NIC: { type: "string" },
          firstName: { type: "string" },
          lastName: { type: "string" },
          address: { type: "string" },
          phoneNumber: { type: "number" },
          dateOfBirth: { type: "string" },
          position: { type: "string" },
          branchId: { type: "number" },
          branchName: { type: "string" },
        },
        required: [
          "id",
          "NIC",
          "firstName",
          "lastName",
          "address",
          "phoneNumber",
          "dateOfBirth",
          "position",
          "branchId",
          "branchName",
        ],
      },
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
      Organization: {
        type: "object",
        properties: {
          id: { type: "number" },
          type: { type: "string" },
          address: { type: "string" },
          phoneNumber: { type: "number" },
          dateOfIncorporation: { type: "string" },
        },
        required: [
          "id",
          "type",
          "address",
          "phoneNumber",
          "dateOfIncorporation",
        ],
      },
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
      User: {
        type: "object",
        properties: {
          id: { type: "number" },
          NIC: { type: "string" },
          firstName: { type: "string" },
          lastName: { type: "string" },
          address: { type: "string" },
          phoneNumber: { type: "number" },
          dateOfBirth: { type: "string" },
        },
        required: [
          "NIC",
          "firstName",
          "lastName",
          "address",
          "phoneNumber",
          "dateOfBirth",
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
