import { Handler } from "openapi-backend";
import conn from "../../helpers/db.js";
import { ProcedureCallPacket, RowDataPacket, QueryError } from "mysql2";
import { User } from "../../models/User.js";

interface TransferBody {
  fromAccountId: number;
  toAccountId: number;
  amount: number;
}

const accountTransfer: Handler<TransferBody> = async (c, _, res) => {
  const { fromAccountId, toAccountId, amount } = c.request.requestBody;
  const user: User = c.security.jwt;

  if (fromAccountId === toAccountId) {
    return res
      .status(400)
      .json({ message: "Cannot transfer to the same account." });
  }

  if (amount <= 0) {
    return res.status(400).json({ message: "Invalid amount." });
  }

  try {
    const query = `
            CALL Online_Transfer(?, ?, ?, ?);
        `;
    const [result] = await conn.execute<ProcedureCallPacket<RowDataPacket[]>>(
      query,
      [user.customer?.id, fromAccountId, toAccountId, amount],
    );
    console.log("Transfer result:", result);
    return res.status(200).json({ message: "Transfer successful." });
  } catch (error) {
    if ((error as QueryError).code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({ message: "Invalid to account ID." });
    } else if (
      (error as QueryError).message === "You are not the owner of the account"
    ) {
      return res
        .status(400)
        .json({ message: "You are not the owner of the account." });
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
    console.error("Failed to transfer:", error);
    return res.status(500).json({ message: "Failed to transfer." });
  }
};

export default accountTransfer;
