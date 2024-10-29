import api from "./api";
import { BranchWiseLateLoanInstallment, BranchWiseTransaction } from "./types";

function getAuthToken(): string | null {
  return sessionStorage.getItem("token");
}

/**
 * Retrieves the branch-wise total transactions report.
 * @returns {Promise<BranchWiseTransaction[]>} - An array of transactions.
 */
export async function getBranchWiseTotalTransactionsReport(): Promise<
  BranchWiseTransaction[]
> {
  try {
    const token = getAuthToken();

    const response = await api.get<BranchWiseTransaction[]>(
      "/report/branchWiseTotalTransactions",
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
      new Error("Failed to retrieve branch wise total transactions report")
    );
  }
}

/**
 * Retrieves the branch-wise late loan installments report.
 * @returns {Promise<BranchWiseLateLoanInstallment[]>} - An array of late loan installments.
 */
export async function getBranchWiseLateLoanInstallmentsReport(): Promise<
  BranchWiseLateLoanInstallment[]
> {
  try {
    const token = getAuthToken();
    const response = await api.get<BranchWiseLateLoanInstallment[]>(
      "/report/branchWiseLateLoanInstallments",
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
      new Error("Failed to retrieve branch wise late loan installments report")
    );
  }
}
