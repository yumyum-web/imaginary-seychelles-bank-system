import api from "./api";
import { Loan, LoanRequest, PendingLoanInstallment } from "./types";

function getAuthToken(): string | null {
  return sessionStorage.getItem("token");
}

/**
 * Retrieves the loan list for a customer.
 * @returns {Promise<Loan[]>} - Array of loans for the customer.
 */
export async function listLoans(): Promise<Loan[]> {
  try {
    const token = getAuthToken();
    const response = await api.get<Loan[]>("/loan/list", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw (
      error.response?.data?.message || new Error("Failed to retrieve loan list")
    );
  }
}

/**
 * Creates a new loan request.
 * @param loanType - The type of the loan ("Business" or "Personal").
 * @param loanAmount - The amount of the loan.
 * @param purpose - The purpose of the loan.
 * @param accountId - The ID of the account associated with the loan.
 * @param timePeriod - The time period for the loan in months.
 * @returns {Promise<string>} - A success message.
 */
export async function createLoanRequest(
  loanType: "Business" | "Personal",
  loanAmount: number,
  purpose: string,
  accountId: number,
  timePeriod: number,
): Promise<string> {
  try {
    const token = getAuthToken();

    // Prepare the request payload
    const payload = {
      loanType,
      loanAmount,
      purpose,
      accountId,
      timePeriod,
    };

    const response = await api.post<{ message: string }>(
      "/loan/request/create",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data.message;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw (
      error.response?.data?.message ||
      new Error("Failed to create loan request")
    );
  }
}

/**
 * Retrieves a list of loan requests for a customer or branch.
 * @returns {Promise<LoanRequest[]>} - A list of loan requests.
 */
export async function listLoanRequests(): Promise<LoanRequest[]> {
  try {
    const token = getAuthToken();

    // Send GET request to retrieve loan requests
    const response = await api.get<LoanRequest[]>("/loan/request/list", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // Return the list of loan requests
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // Handle errors and throw appropriate messages
    throw (
      error.response?.data?.message ||
      new Error("Failed to retrieve loan requests")
    );
  }
}

/**
 * Retrieves pending loan installments for a customer.
 * @returns {Promise<PendingInstallment[]>} - Array of pending installments.
 */
export async function getPendingLoanInstallments(): Promise<
  PendingLoanInstallment[]
> {
  try {
    const token = getAuthToken();
    const response = await api.get<PendingLoanInstallment[]>(
      "/loan/pendingInstallments",
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
      new Error("Failed to retrieve pending loan installments")
    );
  }
}

/**
 * Processes a loan request by accepting or rejecting it.
 * @param requestId - The ID of the loan request to process.
 * @param action - The action to perform ("Accept" or "Reject").
 * @returns {Promise<string>} - A success message.
 */
export async function processLoanRequest(
  requestId: number,
  action: "Accept" | "Reject",
): Promise<string> {
  try {
    const token = getAuthToken();

    const payload = {
      requestId,
      action,
    };
    const response = await api.post<{ message: string }>(
      "/loan/request/process",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data.message;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw (
      error.response?.data?.message ||
      new Error("Failed to process loan request")
    );
  }
}

/**
 * Applies for a loan on behalf of the customer.
 * @param FDId - The ID of the fixed deposit.
 * @param savingsAccountId - The ID of the savings account.
 * @param loanType - Type of the loan ("Business" | "Personal").
 * @param amount - Loan amount in float format.
 * @param purpose - Purpose of the loan.
 * @param timePeriod - Loan repayment time period.
 * @returns {Promise<string>} - Success message upon loan application.
 */
export async function selfApplyForLoan(
  FDId: number,
  savingsAccountId: number,
  loanType: "Business" | "Personal",
  amount: number,
  purpose: string,
  timePeriod: number,
): Promise<string> {
  try {
    const token = getAuthToken();

    // Prepare the request payload
    const payload = {
      FDId,
      savingsAccountId,
      loanType,
      amount,
      purpose,
      timePeriod,
    };

    // Send POST request to apply for the loan
    const response = await api.post<{ message: string }>(
      "/loan/selfApply",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    // Return the success message from the response
    return response.data.message;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw (
      error.response?.data?.message || new Error("Failed to apply for loan")
    );
  }
}
