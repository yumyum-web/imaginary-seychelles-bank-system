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
            $ref: "#/components/responses/BadRequest",
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
    "/account/withdraw": {
      post: {
        summary: "Withdraw money from an account",
        operationId: "accountWithdraw",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  accountId: {
                    type: "number",
                  },
                  amount: {
                    type: "number",
                    format: "float",
                  },
                },
                required: ["accountId", "amount"],
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
          200: {
            description: "Withdrawal successful",
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
            $ref: "#/components/responses/BadRequest",
          },
          500: {
            description: "Failed to withdraw money",
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
    "/account/deposit": {
      post: {
        summary: "Deposit money from an account",
        operationId: "accountDeposit",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  accountId: {
                    type: "number",
                  },
                  amount: {
                    type: "number",
                    format: "float",
                  },
                },
                required: ["accountId", "amount"],
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
          200: {
            description: "Deposit successful",
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
            $ref: "#/components/responses/BadRequest",
          },
          500: {
            description: "Failed to deposit money",
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
    "/account/transfer": {
      post: {
        summary: "Transfer money between accounts",
        operationId: "accountTransfer",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  fromAccountId: {
                    type: "number",
                  },
                  toAccountId: {
                    type: "number",
                  },
                  amount: {
                    type: "number",
                    format: "float",
                  },
                },
                required: ["fromAccountId", "toAccountId", "amount"],
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
          200: {
            description: "Transfer successful",
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
            $ref: "#/components/responses/BadRequest",
          },
          500: {
            description: "Failed to transfer money",
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
    "/account/transactionHistory": {
      get: {
        summary:
          "Get transaction history of an account. Customers can only view for their own accounts. Employees can view for any account.",
        operationId: "accountTransactionHistory",
        parameters: [
          {
            name: "accountId",
            in: "query",
            required: true,
            schema: {
              type: "number",
            },
          },
        ],
        security: [
          {
            jwt: ["customer", "employee"],
          },
        ],
        responses: {
          200: {
            description: "Transaction history retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "number" },
                      type: { type: "string" },
                      activityType: { type: "string" },
                      amount: { type: "number", format: "float" },
                      date: { type: "string" },
                    },
                    required: ["id", "type", "activityType", "amount", "date"],
                  },
                },
              },
            },
          },
          400: {
            $ref: "#/components/responses/BadRequest",
          },
          403: {
            $ref: "#/components/responses/Forbidden",
          },
          500: {
            description: "Failed to retrieve transaction history",
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
    "/account/checking/list": {
      get: {
        summary: "List checking accounts",
        operationId: "listCheckingAccounts",
        parameters: [
          {
            name: "customerId",
            in: "query",
            required: false,
            schema: {
              type: "number",
            },
          },
        ],
        security: [
          {
            jwt: ["customer", "employee"],
          },
        ],
        responses: {
          200: {
            description: "Checking accounts retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "number" },
                      balance: { type: "number", format: "float" },
                      branchId: { type: "number" },
                      branchName: { type: "string" },
                    },
                    required: ["id", "balance", "branchId", "branchName"],
                  },
                },
              },
            },
          },
          403: {
            $ref: "#/components/responses/Forbidden",
          },
          400: {
            $ref: "#/components/responses/BadRequest",
          },
          500: {
            description: "Failed to retrieve checking accounts",
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
    "/account/checking/create": {
      post: {
        summary: "Create a checking account",
        operationId: "createCheckingAccount",
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
                  initialDeposit: {
                    type: "number",
                    format: "float",
                  },
                },
                required: ["customerId", "initialDeposit"],
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
            description: "Checking account created successfully",
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
            $ref: "#/components/responses/BadRequest",
          },
          500: {
            description: "Failed to create checking account",
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
    "/fixedDeposit/create": {
      post: {
        summary: "Create a fixed deposit",
        operationId: "createFixedDeposit",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  initialDeposit: {
                    type: "number",
                    format: "float",
                  },
                  savingsAccountId: {
                    type: "number",
                  },
                  fixedDepositPlanId: {
                    type: "number",
                  },
                },
                required: [
                  "initialDeposit",
                  "savingsAccountId",
                  "fixedDepositPlanId",
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
            description: "Fixed deposit created successfully",
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
            $ref: "#/components/responses/BadRequest",
          },
          500: {
            description: "Failed to create fixed deposit",
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
    "/fixedDeposit/list": {
      get: {
        summary: "List fixed deposits",
        operationId: "listFixedDeposits",
        parameters: [
          {
            name: "customerId",
            in: "query",
            required: false,
            schema: {
              type: "number",
            },
          },
        ],
        security: [
          {
            jwt: ["customer", "employee"],
          },
        ],
        responses: {
          200: {
            description: "Fixed deposits retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/FixedDeposit",
                  },
                },
              },
            },
          },
          400: {
            $ref: "#/components/responses/BadRequest",
          },
          500: {
            description: "Failed to retrieve fixed deposits",
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
    "/fixedDeposit/plans": {
      get: {
        summary: "List available fixed deposit plans",
        operationId: "fixedDepositPlans",
        security: [
          {
            jwt: ["logged-in"],
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
                    $ref: "#/components/schemas/FixedDepositPlan",
                  },
                },
              },
            },
          },
          500: {
            description: "Failed to list fixed deposit plans",
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
            $ref: "#/components/responses/BadRequest",
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
            $ref: "#/components/responses/BadRequest",
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
            $ref: "#/components/responses/BadRequest",
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
        parameters: [
          {
            name: "customerId",
            in: "query",
            required: false,
            schema: {
              type: "number",
            },
          },
        ],
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
            $ref: "#/components/responses/BadRequest",
          },
          401: {
            $ref: "#/components/responses/Unauthorized",
          },
        },
      },
    },
    "/account/savings/create": {
      post: {
        summary: "Create a savings account",
        operationId: "createSavingsAccount",
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
                  planId: {
                    type: "number",
                  },
                  initialDeposit: {
                    type: "number",
                    format: "float",
                  },
                },
                required: ["customerId", "planId", "initialDeposit"],
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
            description: "Savings account created successfully",
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
            $ref: "#/components/responses/BadRequest",
          },
          500: {
            description: "Failed to create savings account",
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
    "/account/savings/plans": {
      get: {
        summary: "List available savings account plans",
        operationId: "savingsAccountPlans",
        security: [
          {
            jwt: ["logged-in"],
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
                    $ref: "#/components/schemas/SavingsAccountPlan",
                  },
                },
              },
            },
          },
          500: {
            description: "Failed to list savings account plans",
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
    "/report/branchWiseTotalTransactions": {
      get: {
        summary: "Get branch wise total transactions report",
        operationId: "branchWiseTotalTransactionsReport",
        security: [
          {
            jwt: ["manager"],
          },
        ],
        responses: {
          200: {
            description: "Branch wise total transactions report retrieved",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "number" },
                      type: { type: "string" },
                      activityType: { type: "string" },
                      accountId: { type: "number" },
                      amount: { type: "number", format: "float" },
                      date: { type: "string" },
                    },
                    required: [
                      "id",
                      "type",
                      "activityType",
                      "accountId",
                      "amount",
                      "date",
                    ],
                  },
                },
              },
            },
          },
          500: {
            description:
              "Failed to retrieve branch wise total transactions report",
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
    "/report/branchWiseLateLoanInstallments": {
      get: {
        summary: "Get branch wise late loan installments report",
        operationId: "branchWiseLateLoanInstallmentsReport",
        security: [
          {
            jwt: ["manager"],
          },
        ],
        responses: {
          200: {
            description: "Branch wise late loan installments report retrieved",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "number" },
                      loanAmount: { type: "number", format: "float" },
                      customerId: { type: "number" },
                      loanType: { type: "string" },
                      loanStartDate: { type: "string" },
                      loanEndDate: { type: "string" },
                      amount: { type: "number", format: "float" },
                      dueDate: { type: "string" },
                    },
                    required: [
                      "id",
                      "loanAmount",
                      "customerId",
                      "loanType",
                      "loanStartDate",
                      "loanEndDate",
                      "amount",
                      "dueDate",
                    ],
                  },
                },
              },
            },
          },
          500: {
            description:
              "Failed to retrieve branch wise late loan installments report",
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
      BadRequest: {
        description: "400 Bad Request",
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
                message: {
                  type: "string",
                },
              },
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
      FixedDeposit: {
        type: "object",
        properties: {
          id: { type: "number" },
          balance: { type: "number", format: "float" },
          planId: { type: "number" },
          interestRate: { type: "number", format: "float" },
          duration: { type: "number" },
          openedDate: { type: "string" },
          branchId: { type: "number" },
          branchName: { type: "string" },
        },
        required: [
          "id",
          "balance",
          "planId",
          "interestRate",
          "duration",
          "openedDate",
          "branchId",
          "branchName",
        ],
      },
      FixedDepositPlan: {
        type: "object",
        properties: {
          id: { type: "number" },
          interestRate: { type: "number", format: "float" },
          duration: { type: "number" },
        },
        required: ["id", "interestRate", "duration"],
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
      SavingsAccountPlan: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          interestRate: { type: "number", format: "float" },
          minimumBalance: { type: "number", format: "float" },
        },
        required: ["id", "name", "interestRate", "minimumBalance"],
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
