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
  interestRate: number;
  duration: number;
};

export interface BranchWiseTransaction {
  id: number;
  type: string;
  activityType: string;
  accountId: number;
  amount: number;
  date: string;
}
