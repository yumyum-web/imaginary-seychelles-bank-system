import { Handler } from "openapi-backend";
import conn from "../../helpers/db.js";
import { RowDataPacket } from "mysql2";

interface SelfApplyRequestBody {
  customerId: number;
  FDId: number;
  savingsAccId: number;
  loanType: string;
  amount: number;
  purpose: string;
  timePeriod: number;
}

const selfapply: Handler<SelfApplyRequestBody> = async (c, _, res) => {
  const {
    customerId,
    FDId,
    savingsAccId,
    loanType,
    amount,
    purpose,
    timePeriod,
  } = c.request.requestBody;

  try {
    // Call stored procedure for self-apply loan
    const selfApplyQuery = "CALL Self_Apply_Loan(?, ?, ?, ?, ?, ?, ?)";
    const [selfApplyResult] = await conn.execute<RowDataPacket[]>(
      selfApplyQuery,
      [customerId, FDId, savingsAccId, loanType, amount, purpose, timePeriod],
    );

    // Check if the procedure executed successfully
    if (
      selfApplyResult &&
      selfApplyResult[0]?.Message === "Loan application successful."
    ) {
      return res.status(201).json({
        message: "Loan application successful.",
      });
    } else {
      return res.status(400).json({
        message:
          "Loan application failed. Please ensure all conditions are met.",
      });
    }
  } catch (error) {
    console.error("Loan application failed:", error);
    return res.status(500).json({ message: "Failed to apply for loan." });
  }
};

export default selfapply;
