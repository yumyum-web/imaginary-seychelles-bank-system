import { Handler } from "openapi-backend";
import conn from "../../helpers/db.js";

interface AcceptLoanRequestBody {
  managerId: number;
  requestId: number;
  action: "Accept" | "Reject";
}

const process: Handler<AcceptLoanRequestBody> = async (c, _, res) => {
  const { managerId, requestId, action } = c.request.requestBody;

  try {
    // Call stored procedure to accept or reject the loan request
    await conn.execute("CALL Accept_Loan_Request(?, ?, ?)", [
      managerId,
      requestId,
      action,
    ]);

    // Response message based on action
    return res.status(200).json({
      message: `Loan request ${action.toLowerCase()}ed successfully.`,
      requestId,
      action,
    });
  } catch (error) {
    console.error("Failed to process loan request:", error);
    return res.status(500).json({ message: "Failed to process loan request." });
  }
};

export default process;
