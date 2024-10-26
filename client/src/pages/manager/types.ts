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

export interface loanRequests {
  requestId: string;
  accId: string;
  type: string;
  purpose: string;
  amount: number;
}
