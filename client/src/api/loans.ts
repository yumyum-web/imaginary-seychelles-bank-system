import api from "./api";
import { LoanRequest } from "./types";

function getAuthToken(): string | null {
  return sessionStorage.getItem("token");
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
