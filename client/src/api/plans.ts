import api from "./api";
import { FixedDepositPlan, SavingsAccountPlan } from "./types";

function getAuthToken(): string | null {
  return sessionStorage.getItem("token");
}

export async function getSavingsAccountPlans(): Promise<SavingsAccountPlan[]> {
  const token = getAuthToken();
  try {
    const response = await api.get<SavingsAccountPlan[]>(
      "/account/savings/plans",
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
      new Error("Failed to list savings account plans")
    );
  }
}

export async function getFixedDepositPlans(): Promise<FixedDepositPlan[]> {
  const token = getAuthToken();
  try {
    const response = await api.get<FixedDepositPlan[]>("/fixedDeposit/plans", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw (
      error.response?.data?.message ||
      new Error("Failed to list fixed deposit plans")
    );
  }
}
