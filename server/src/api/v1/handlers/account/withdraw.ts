import { Handler } from "openapi-backend";
import conn from "../../helpers/db.js";
import { ProcedureCallPacket, QueryError, RowDataPacket } from "mysql2";

interface WithdrawBody {
  accountId: number;
  amount: number;
}

const accountWithdraw: Handler<WithdrawBody> = async (c, _, res) => {
  const { accountId, amount } = c.request.requestBody;

  if (amount <= 0) {
    return res.status(400).json({ message: "Invalid amount." });
  }

  try {
    const query = `
            CALL Employee_Withdraw(?, ?);
        `;
    const [result] = await conn.execute<ProcedureCallPacket<RowDataPacket[]>>(
      query,
      [accountId, amount],
    );
    console.log("Withdraw result:", result);
    return res.status(200).json({ message: "Withdrawal successful." });
  } catch (error) {
    if ((error as QueryError).code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({ message: "Invalid account ID." });
    } else if (
      (error as QueryError).message ===
      "Amount exceeds the maximum withdrawal limit."
    ) {
      return res
        .status(400)
        .json({ message: "Insufficient balance in the account." });
    } else if (
      (error as QueryError).message === "No more withdrawals allowed."
    ) {
      return res.status(400).json({ message: "No more withdrawals allowed." });
    }
    console.error("Failed to withdraw:", error);
    return res.status(500).json({ message: "Failed to withdraw." });
  }
};

export default accountWithdraw;
