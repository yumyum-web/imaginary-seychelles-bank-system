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
