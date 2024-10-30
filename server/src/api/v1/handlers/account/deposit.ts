import { Handler } from "openapi-backend";
import conn from "../../helpers/db.js";
import { ProcedureCallPacket, QueryError, RowDataPacket } from "mysql2";

interface DepositBody {
  accountId: number;
  amount: number;
}

const accountDeposit: Handler<DepositBody> = async (c, _, res) => {
  const { accountId, amount } = c.request.requestBody;

  if (amount <= 0) {
    return res.status(400).json({ message: "Invalid amount." });
  }

  try {
    const query = `
            CALL Employee_Deposit(?, ?);
        `;
    const [result] = await conn.execute<ProcedureCallPacket<RowDataPacket[]>>(
      query,
      [accountId, amount],
    );
    console.log("Deposit result:", result);
    return res.status(200).json({ message: "Deposit successful." });
  } catch (error) {
    if ((error as QueryError).code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({ message: "Invalid account ID." });
    }
    console.error("Failed to deposit:", error);
    return res.status(500).json({ message: "Failed to deposit." });
  }
};

export default accountDeposit;
