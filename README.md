# Imaginary Seychelles Bank System

## Setting up development environment

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

Here's a comprehensive `README.md` file that incorporates all the details you've shared:

```markdown
# Imaginary Seychelles Bank Backend API

This project provides a RESTful API for the Imaginary Seychelles Bank's web-based system. The API is built using Node.js and TypeScript, with robust endpoints for handling user authentication, account management, and profile information.

## Table of Contents
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
  - [Authentication](#authentication)
  - [User Profile Management](#user-profile-management)
  - [Account Transactions](#account-transactions)
- [Project Structure](#project-structure)
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
   DATABASE_URL="your_database_url"
   JWT_SECRET="your_jwt_secret"
   PORT=3000
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

After starting the server, the API will be available at `http://localhost:3000`. You can use a tool like [Postman](https://www.postman.com/) or `curl` to test the endpoints.

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

## Project Structure

```
|-- src/
|   |-- controllers/  # Route logic
|   |-- models/       # Data models
|   |-- routes/       # API route definitions
|   |-- middlewares/  # Middleware functions
|   |-- utils/        # Utility functions
|-- tests/            # Test cases
|-- .env              # Environment variables
|-- README.md
|-- tsconfig.json     # TypeScript configuration
|-- package.json      # Project dependencies and scripts
```

## Security

The API uses JWT (JSON Web Token) for secure access to endpoints. Role-based security controls ensure that different types of users (customer, employee, organization) have the appropriate access levels.

## License

This project is licensed under the MIT License.

---

For further questions, please refer to the API documentation or reach out to the maintainers.
```

This `README.md` covers all aspects of the API and is ready to include in your repository. Let me know if there’s anything more specific you'd like to add.