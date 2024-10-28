// src/api/createLoanRequest.ts
import api from "./api";

enum LoanType {
  Business = "Business",
  Personal = "Personal",
}

const createLoanRequestAPI = async (data: {
  accountId: number;
  loanType: LoanType;
  purpose: string;
  loanAmount: number;
  timePeriod: number; // Add timePeriod here
}) => {
  const token = sessionStorage.getItem("token"); // Get the token from storage
  const response = await api.post("/loan/request/create", data, {
    headers: {
      Authorization: `Bearer ${token}`, // Add the token to the headers
    },
  });
  return response.data;
};

export default createLoanRequestAPI;
