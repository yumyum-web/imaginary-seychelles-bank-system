import api from "./api";

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
