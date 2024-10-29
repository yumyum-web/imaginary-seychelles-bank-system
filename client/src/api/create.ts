import api from "./api";
// Helper function to retrieve the JWT token from session storage
function getAuthToken(): string | null {
  return sessionStorage.getItem("token");
}

/**
 * Creates a new savings account.
 * @param customerId - The ID of the customer.
 * @param planId - The ID of the savings account plan.
 * @param initialDeposit - The initial deposit amount.
 * @returns {Promise<string>} - A success message.
 */
export async function createSavingsAccount(
  customerId: number,
  planId: number,
  initialDeposit: number,
): Promise<string> {
  try {
    const token = getAuthToken();

    // Prepare the request payload
    const payload = {
      customerId,
      planId,
      initialDeposit,
    };

    // Send POST request to create a savings account
    const response = await api.post<{ message: string }>(
      "/account/savings/create",
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
    // Handle errors and throw appropriate messages
    throw (
      error.response?.data?.message ||
      new Error("Failed to create savings account")
    );
  }
}

/**
 * Creates a new checking account.
 * @param customerId - The ID of the customer.
 * @param initialDeposit - The initial deposit amount.
 * @returns {Promise<string>} - A success message.
 */
export async function createCheckingAccount(
  customerId: number,
  initialDeposit: number,
): Promise<string> {
  try {
    const token = getAuthToken();

    // Prepare the request payload
    const payload = {
      customerId,
      initialDeposit,
    };

    // Send POST request to create a checking account
    const response = await api.post<{ message: string }>(
      "/account/checking/create",
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
    // Handle errors and throw appropriate messages
    throw (
      error.response?.data?.message ||
      new Error("Failed to create checking account")
    );
  }
}

/**
 * Creates a new fixed deposit.
 * @param customerId - The ID of the customer.
 * @param initialDeposit - The initial deposit amount.
 * @param savingsAccountId - The ID of the savings account.
 * @param fixedDepositPlanId - The ID of the fixed deposit plan.
 * @returns {Promise<string>} - A success message.
 */
export async function createFixedDeposit(
  customerId: number,
  initialDeposit: number,
  savingsAccountId: number,
  fixedDepositPlanId: number,
): Promise<string> {
  try {
    const token = getAuthToken();

    // Prepare the request payload
    const payload = {
      customerId,
      initialDeposit,
      savingsAccountId,
      fixedDepositPlanId,
    };

    // Send POST request to create a fixed deposit
    const response = await api.post<{ message: string }>(
      "/fixedDeposit/create",
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
    // Handle errors and throw appropriate messages
    throw (
      error.response?.data?.message ||
      new Error("Failed to create fixed deposit")
    );
  }
}
