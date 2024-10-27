import { Handler } from "openapi-backend";
import conn from "../../helpers/db.js";

interface LoanRequestBody {
  employeeId: number;
  loanType: "Business" | "Personal";
  loanAmount: number;
  purpose: string;
  accountId: number;
  timePeriod: number;
}

const create: Handler<LoanRequestBody> = async (c, _, res) => {
  const { employeeId, loanType, loanAmount, purpose, accountId, timePeriod } =
    c.request.requestBody;

  try {
    // Call stored procedure to create a loan request
    await conn.execute("CALL Create_Loan_Request(?, ?, ?, ?, ?, ?)", [
      employeeId,
      loanType,
      loanAmount,
      purpose,
      accountId,
      timePeriod,
    ]);

    // Response if procedure completes successfully
    return res.status(201).json({
      message: "Loan request created successfully.",
      loanType,
      amount: loanAmount,
      purpose,
      status: "Pending",
      timePeriod,
    });
  } catch (error) {
    console.error("Failed to create loan request:", error);
    return res.status(500).json({ message: "Failed to create loan request." });
  }
};

export default create;
