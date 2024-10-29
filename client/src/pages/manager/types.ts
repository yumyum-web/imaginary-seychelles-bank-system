export interface lateLoanInstallments {
  loanId: string;
  accId: string;
  customerId: string;
  type: string;
  amount: number;
  dueDate: Date;
}

export interface Transactions {
  date: Date;
  transactionId: string;
  accId: string;
  transactionType: string;
  activityType: string;
  amount: number;
}

export enum LoanType {
  Personal = "Personal",
  Business = "Business",
}
export interface loanRequests {
  id: number;
  customerId: number;
  type: LoanType;
  purpose: string;
  amount: number;
}
