import api from "./api";
// Helper function to retrieve the JWT token from session storage
function getAuthToken(): string | null {
  return sessionStorage.getItem("token");
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
