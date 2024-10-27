import { Handler } from "openapi-backend";
import conn from "../../helpers/db.js";
import { RowDataPacket } from "mysql2";
import { User } from "../../models/User.js";

interface SelfApplyRequestBody {
  FDId: number;
  savingsAccountId: number;
  loanType: string;
  amount: number;
  purpose: string;
  timePeriod: number;
}

const selfApply: Handler<SelfApplyRequestBody> = async (c, _, res) => {
  const { FDId, savingsAccountId, loanType, amount, purpose, timePeriod } =
    c.request.requestBody;
  const user: User = c.security.jwt;

  try {
    // Call stored procedure for self-apply loan
    const selfApplyQuery = `CALL Self_Apply_Loan(?, ?, ?, ?, ?, ?, ?)`;
    const [selfApplyResult] = await conn.execute<RowDataPacket[]>(
      selfApplyQuery,
      [
        user.customer?.id,
        FDId,
        savingsAccountId,
        loanType,
        amount,
        purpose,
        timePeriod,
      ],
    );

    console.log("Self apply result:", selfApplyResult);
    // Check if the procedure executed successfully
    if (
      selfApplyResult.length !== 0 &&
      selfApplyResult[0].length !== 0 &&
      selfApplyResult[0][0]?.Message === "Loan created successfully."
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

export default selfApply;
