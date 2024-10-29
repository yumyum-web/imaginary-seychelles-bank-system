export interface CheckingAccount {
  id: number;
  balance: number;
  branchId: number;
  branchName: string;
}

export interface SavingsAccount {
  id: number;
  balance: number;
  noOfWithdrawals: number;
  planId: number;
  planName: string;
  branchName: string;
}

export interface Transaction {
  id: number;
  type: string;
  activityType: string;
  amount: number;
  date: string;
}

export type SavingsAccountPlan = {
  id: number;
  name: string;
  interestRate: number;
  minimumBalance: number;
};

export type FixedDepositPlan = {
  id: number;
  name: string;
  interestRate: number;
  tenure: string; // e.g., "6 months", "1 year"
  minimumDeposit: number;
};
