import { Handler } from "openapi-backend";
import conn from "../../../helpers/db.js";
import { User } from "../../../models/User.js";

interface LoanRequestBody {
  loanType: "Business" | "Personal";
  loanAmount: number;
  purpose: string;
  accountId: number;
  timePeriod: number;
}

const createLoanRequest: Handler<LoanRequestBody> = async (c, _, res) => {
  const { loanType, loanAmount, purpose, accountId, timePeriod } =
    c.request.requestBody;
  const user: User = c.security.jwt;

  try {
    // Call stored procedure to create a loan request
    const [Result] = await conn.execute(
      "CALL Create_Loan_Request(?, ?, ?, ?, ?, ?)",
      [user.employee?.id, loanType, loanAmount, purpose, accountId, timePeriod],
    );

    console.log("Loan request:", Result);
    // Response if procedure completes successfully
    return res.status(201).json({
      message: "Loan request created successfully.",
    });
  } catch (error) {
    console.error("Failed to create loan request:", error);
    return res.status(500).json({ message: "Failed to create loan request." });
  }
};

export default createLoanRequest;
