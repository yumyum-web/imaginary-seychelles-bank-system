import api from "./api";
enum LoanType {
  Business = "Business",
  Personal = "Personal",
}
const onlineLoanRequestAPI = async (data: {
  FDId: number;
  savingsAccountId: number;
  loanType: LoanType;
  amount: number;
  purpose: string;
  timePeriod: number;
}) => {
  const token = sessionStorage.getItem("token"); // Get the token from storage
  const response = await api.post("/loan/selfApply", data, {
    headers: {
      Authorization: `Bearer ${token}`, // Add the token to the headers
    },
  });
  return response.data;
};

export default onlineLoanRequestAPI;
