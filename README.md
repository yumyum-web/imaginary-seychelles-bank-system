# Imaginary Seychelles Bank System

## Setting up the development environment

### Prerequisites

- Node 22.9.0 or higher
- [pnpm](https://pnpm.io/) v9.11.0 or higher
- git

### Installation

1. Clone the repository to your local machine and navigate to the project directory.
2. Run `pnpm install` to install the project dependencies.

## Git Workflow

- The `main` branch is the default branch.
- Commiting directly or merging to the `main` branch locally is not allowed.
- Create a new branch for each feature or bug fix.
- Push the branch to the remote repository and create a pull request when ready for review.
- Addding `Closes #issue-number` in the pull request description or in any commit message will automatically close the issue when the pull request is merged.

## API DOC

This project provides a RESTful API for the Imaginary Seychelles Bank's web-based system. The API is built using Node.js and TypeScript, with robust endpoints for handling user authentication, account management, and profile information.

## Table of Contents
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
  - [Authentication](#authentication)
  - [User Profile Management](#user-profile-management)
  - [Account Transactions](#account-transactions)
- [Security](#security)
- [License](#license)

---

## Requirements
- Node.js >= 14.x
- TypeScript >= 4.x
- Docker (optional, for containerized deployment)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/imaginary-seychelles-bank.git
   cd imaginary-seychelles-bank
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the root directory with the following variables:

   ```plaintext
    DB_HOST=
    DB_USER=
    DB_PASSWORD=
    DB_NAME=
    DB_PORT=

    JWT_TOKEN_SECRET=
    JWT_TOKEN_EXPIRES_IN= 
   ```

4. **Run the application**
   ```bash
   npm run start
   ```

To run in development mode with live reload:
   ```bash
   npm run dev
   ```

## Usage

After starting the server, the API will be available at `http://localhost:5000`. You can use a tool like [Postman](https://www.postman.com/) or `curl` to test the endpoints.

## API Documentation

The API follows OpenAPI 3.0 standards, ensuring a structured and well-documented interface. Below is a summary of the main endpoints.

### Authentication

- **Login**
  - **Endpoint:** `/auth/login`
  - **Method:** `POST`
  - **Description:** Logs in the user by providing a JWT token for authenticated access.
  - **Request Body:**
    ```json
    {
      "username": "user1",
      "password": "password123"
    }
    ```
  - **Responses:**
    - `200 OK`: Returns a JSON object containing the authentication token and user data.
    - `400 Bad Request`: Invalid credentials.

### User Profile Management

- **Get User Profile**
  - **Endpoint:** `/profile/user`
  - **Method:** `GET`
  - **Description:** Retrieves the profile of the logged-in user.
  - **Responses:**
    - `200 OK`: Returns user profile data.
    - `500 Internal Server Error`: Unable to retrieve profile.

- **Get Organization Profile**
  - **Endpoint:** `/profile/organization`
  - **Method:** `GET`
  - **Description:** Retrieves the organization profile associated with the user.
  - **Responses:**
    - `200 OK`: Returns organization profile data.
    - `500 Internal Server Error`: Unable to retrieve profile.

- **Get Employee Profile**
  - **Endpoint:** `/profile/employee`
  - **Method:** `GET`
  - **Description:** Retrieves the employee profile.
  - **Responses:**
    - `200 OK`: Returns employee profile data.
    - `500 Internal Server Error`: Unable to retrieve profile.

### Account Transactions

- **Withdraw**
  - **Endpoint:** `/account/withdraw`
  - **Method:** `POST`
  - **Description:** Allows employees to withdraw money from an account.
  - **Request Body:**
    ```json
    {
      "accountId": 123,
      "amount": 100.0
    }
    ```
  - **Responses:**
    - `200 OK`: Withdrawal successful.
    - `400 Bad Request`: Invalid request.
    - `500 Internal Server Error`: Unable to process withdrawal.

- **Deposit**
  - **Endpoint:** `/account/deposit`
  - **Method:** `POST`
  - **Description:** Allows employees to deposit money into an account.
  - **Request Body:**
    ```json
    {
      "accountId": 123,
      "amount": 100.0
    }
    ```
  - **Responses:**
    - `200 OK`: Deposit successful.
    - `400 Bad Request`: Invalid request.
    - `500 Internal Server Error`: Unable to process deposit.

- **Transfer**
  - **Endpoint:** `/account/transfer`
  - **Method:** `POST`
  - **Description:** Allows customers to transfer money between their accounts.
  - **Request Body:**
    ```json
    {
      "fromAccountId": 123,
      "toAccountId": 456,
      "amount": 100.0
    }
    ```
  - **Responses:**
    - `200 OK`: Transfer successful.
    - `400 Bad Request`: Invalid request.
    - `500 Internal Server Error`: Unable to process transfer.

- **Transaction History**
  - **Endpoint:** `/account/transactionHistory`
  - **Method:** `GET`
  - **Description:** Retrieves the transaction history for a specified account.
  - **Query Parameter:**
    - `accountId` (required): ID of the account.
  - **Responses:**
    - `200 OK`: Transaction history retrieved successfully.
    - `403 Forbidden`: Access denied.
    - `500 Internal Server Error`: Unable to retrieve transaction history.

- **List Checking Accounts**
  - **Endpoint:** `/account/checking/list`
  - **Method:** `GET`
  - **Description:** Lists checking accounts for customers and employees.
  - **Query Parameter:** `customerId` (optional)
  - **Responses:**
    - `200 OK`: Returns list of checking accounts.
    - `403 Forbidden`: Access denied.
    - `500 Internal Server Error`: Unable to retrieve accounts.

---
- **List Savings Accounts**
    - **Method**: `GET`
    - **Endpoint**: `/account/savings/list`
    - **Description**: Lists the savings accounts of a customer. Employees can list any customer’s accounts, while customers can list only their own.
    - **Parameters**:
    - `customerId` (optional, query): The ID of the customer whose savings accounts are to be retrieved.
    - **Authorization**: Requires a JWT with either `customer` or `employee` role.
    - **Responses**:
    - `200`: Returns a JSON array of savings accounts.
    - `400`: Bad request due to invalid parameters.
    - `401`: Unauthorized access (invalid or missing JWT token).

---

- **Create a Savings Account**
    - **Method**: `POST`
    - **Endpoint**: `/account/savings/create`
    - **Description**: Creates a new savings account for a specified customer.
    - **Request Body**:
    - `customerId` (number, required): The ID of the customer.
    - `planId` (number, required): The ID of the savings plan.
    - `initialDeposit` (number, required, float): Initial deposit amount.
    - **Authorization**: Requires a JWT with `employee` role.
    - **Responses**:
    - `201`: Returns a success message upon account creation.
    - `400`: Bad request due to invalid parameters.
    - `500`: Server error, indicating account creation failure.

---

- **List Savings Account Plans**
    - **Method**: `GET`
    - **Endpoint**: `/account/savings/plans`
    - **Description**: Lists all available savings account plans.
    - **Authorization**: Requires a JWT with any `logged-in` role.
    - **Responses**:
    - `200`: Returns a JSON array of savings account plans.
    - `500`: Server error, indicating failure to retrieve plans.

---

- **Branch-wise Total Transactions Report**
    - **Method**: `GET`
    - **Endpoint**: `/report/branchWiseTotalTransactions`
    - **Description**: Retrieves a report of total transactions by branch.
    - **Authorization**: Requires a JWT with `manager` role.
    - **Responses**:
    - `200`: Returns a JSON array with transaction details for each branch.
    - `500`: Server error, indicating report retrieval failure.

---

- **Branch-wise Late Loan Installments Report**
    - **Method**: `GET`
    - **Endpoint**: `/report/branchWiseLateLoanInstallments`
    - **Description**: Retrieves a report of late loan installments by branch.
    - **Authorization**: Requires a JWT with `manager` role.
    - **Responses**:
    - `200`: Returns a JSON array with details of late installments for each branch.
    - `500`: Server error, indicating report retrieval failure.

---

### Account Endpoints
- **Create Checking Account**: `POST /account/checking/create` - Create a new checking account with an initial deposit for a specified customer.
  
### Fixed Deposit Endpoints
- **Create Fixed Deposit**: `POST /fixedDeposit/create` - Create a new fixed deposit account associated with a savings account and deposit plan.
- **List Fixed Deposits**: `GET /fixedDeposit/list` - Retrieve a list of fixed deposits, optionally filtered by customer ID.
- **List Fixed Deposit Plans**: `GET /fixedDeposit/plans` - Retrieve a list of available fixed deposit plans.

### Loan Endpoints
- **Self-Apply for a Loan**: `POST /loan/selfApply` - Customers can apply for a loan directly using their savings and fixed deposit accounts.
- **Create Loan Request**: `POST /loan/request/create` - Employees can create loan requests on behalf of customers.
- **Process Loan Request**: `POST /loan/request/process` - Managers can accept or reject loan requests.
- **Retrieve Loan List**: `GET /loan/list` - Customers can retrieve their loan information.
- **Get Pending Loan Installments**: `GET /loan/pendingInstallments` - Retrieve details of pending loan installments.
- **Get Loan Requests**: `GET /loan/request/list` - Retrieve loan requests made by customers or branches.

---

- **Shared Response Components**
    - **403 Forbidden**: Indicates access is forbidden, with JSON response including `status` and `err` fields.
    - **401 Unauthorized**: Indicates unauthorized access, with JSON response including `status` and `err` fields.
    - **400 Bad Request**: Returns a JSON object indicating invalid request parameters or input errors.

## Security

The API uses JWT (JSON Web Token) to secure endpoint access. Role-based security controls ensure that different types of users (customer, employee, organization) have the appropriate access levels.

## License

This project is licensed under the GPLv3 License.

---

For further questions, please refer to the API documentation or reach out to the maintainers.
