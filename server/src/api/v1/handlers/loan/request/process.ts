import { Handler } from "openapi-backend";
import conn from "../../../helpers/db.js";
import { User } from "../../../models/User.js";
import { ResultSetHeader } from "mysql2";

interface ProcessLoanRequestBody {
  requestId: number;
  action: "Accept" | "Reject";
}

const processLoanRequest: Handler<ProcessLoanRequestBody> = async (
  c,
  _,
  res,
) => {
  const { requestId, action } = c.request.requestBody;
  const user: User = c.security.jwt;

  try {
    // Call stored procedure to accept or reject the loan request
    const [result] = await conn.execute<ResultSetHeader[]>(
      "CALL Accept_Loan_Request(?, ?, ?)",
      [user.employee?.id, requestId, action],
    );

    console.log("Loan request processed:", result);
    // Response message based on action
    return res.status(200).json({
      message: `Loan request processed successfully.`,
    });
  } catch (error) {
    console.error("Failed to process loan request:", error);
    return res.status(500).json({ message: "Failed to process loan request." });
  }
};

export default processLoanRequest;
