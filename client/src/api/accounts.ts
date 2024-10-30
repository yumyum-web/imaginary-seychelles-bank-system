// src/api/account.ts
import api from "./api";
import {
  CheckingAccount,
  FixedDeposit,
  SavingsAccount,
  Transaction,
} from "./types";

// Helper function to retrieve the JWT token from session storage
function getAuthToken(): string | null {
  return sessionStorage.getItem("token");
}

/**
 * Fetches the list of checking accounts.
 * @returns {Promise<CheckingAccount[]>} - Array of checking accounts.
 */
export async function listCheckingAccounts(): Promise<CheckingAccount[]> {
  try {
    const token = getAuthToken();
    const response = await api.get<CheckingAccount[]>(
      "/account/checking/list",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw (
      error.response?.data?.message ||
      new Error("Failed to retrieve checking accounts")
    );
  }
}

/**
 * Fetches the list of savings accounts for a specific customer.
 * @returns {Promise<SavingsAccount[]>} - Array of savings accounts.
 */
export async function listSavingsAccounts(): Promise<SavingsAccount[]> {
  try {
    const token = getAuthToken();
    const response = await api.get<SavingsAccount[]>("/account/savings/list", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw (
      error.response?.data?.message ||
      new Error("Failed to retrieve savings accounts")
    );
  }
}

/**
 * Fetches the list of fixed deposits, optionally filtered by customer ID.
 * @param customerId - (Optional) ID of the customer to filter deposits.
 * @returns {Promise<FixedDeposit[]>} - Array of fixed deposits.
 */
export async function listFixedDeposits(): Promise<FixedDeposit[]> {
  try {
    const token = getAuthToken();

    const response = await api.get<FixedDeposit[]>("/fixedDeposit/list", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // Handle errors appropriately
    throw (
      error.response?.data?.message ||
      new Error("Failed to retrieve fixed deposits")
    );
  }
}

/**
 * Fetches the transaction history for a specific account.
 * @param {number} accountID - ID of the account whose transaction history to retrieve.
 * @returns {Promise<Transaction[]>} - Array of transactions.
 */
export async function getTransactionHistory(
  accountID: number,
): Promise<Transaction[]> {
  try {
    const token = getAuthToken();
    const response = await api.get<Transaction[]>(
      "/account/transactionHistory",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { accountId: accountID },
      },
    );
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error);
    throw (
      error.response?.data?.message ||
      new Error("Failed to retrieve transaction history")
    );
  }
}

/**
 * Transfers money between accounts.
 * @param {number} fromAccountId - ID of the account to transfer from.
 * @param {number} toAccountId - ID of the account to transfer to.
 * @param {number} amount - Amount to transfer.
 * @returns {Promise<string>} - Success message from the response.
 */
export async function transferMoney(
  fromAccountId: number,
  toAccountId: number,
  amount: number,
): Promise<string> {
  try {
    const token = getAuthToken();
    const response = await api.post<{ message: string }>(
      "/account/transfer",
      {
        fromAccountId,
        toAccountId,
        amount,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data.message;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw (
      error.response?.data?.message || new Error("Failed to transfer money")
    );
  }
}

/**
 * Withdraws money from a specified account.
 * @param accountId - The ID of the account to withdraw from.
 * @param amount - The amount to withdraw.
 * @returns {Promise<string>} - Success message indicating withdrawal status.
 */
export async function withdrawMoney(
  accountId: number,
  amount: number,
): Promise<string> {
  try {
    const token = getAuthToken();
    const response = await api.post<{ message: string }>(
      "/account/withdraw",
      {
        accountId,
        amount,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data.message;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw (
      error.response?.data?.message || new Error("Failed to withdraw money")
    );
  }
}

/**
 * Deposits money into a specified account.
 * @param accountId - The ID of the account to deposit into.
 * @param amount - The amount to deposit.
 * @returns {Promise<string>} - Success message indicating deposit status.
 */
export async function depositMoney(
  accountId: number,
  amount: number,
): Promise<string> {
  try {
    const token = getAuthToken();
    const response = await api.post<{ message: string }>(
      "/account/deposit",
      {
        accountId,
        amount,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data.message;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response?.data?.message || new Error("Failed to deposit money");
  }
}
