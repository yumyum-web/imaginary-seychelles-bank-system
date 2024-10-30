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

export interface BranchWiseLateLoanInstallment {
  id: number;
  loanAmount: number;
  customerId: number;
  loanType: string;
  loanStartDate: string;
  loanEndDate: string;
  amount: number;
  dueDate: string;
}

export interface Loan {
  loanId: number;
  loanType: string;
  amount: number;
  interestRate: number;
  purpose: string;
  requestId?: number;
  startDate: string;
  endDate: string;
}

export interface PendingLoanInstallment {
  id: number;
  amount: number;
  dueDate: string;
}

export interface LoanRequest {
  id: number;
  employeeId: number;
  customerId: number;
  type: "Business" | "Personal";
  amount: number;
  purpose: string;
  status: "Pending" | "Approved" | "Rejected";
  timePeriod: number;
}

export interface FixedDeposit {
  id: number;
  balance: number;
  planId: number;
  interestRate: number;
  duration: number;
  openedDate: string;
  branchId: number;
  branchName: string;
}
