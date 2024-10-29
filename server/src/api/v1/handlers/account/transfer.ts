import { Handler } from "openapi-backend";
import conn from "../../helpers/db.js";
import { ProcedureCallPacket, RowDataPacket } from "mysql2";
import { User } from "../../models/User.js";

interface TransferBody {
  fromAccountId: number;
  toAccountId: number;
  amount: number;
}

const accountTransfer: Handler<TransferBody> = async (c, _, res) => {
  const { fromAccountId, toAccountId, amount } = c.request.requestBody;
  const user: User = c.security.jwt;

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
    console.error("Failed to transfer:", error);
    return res.status(500).json({ message: "Failed to transfer." });
  }
};

export default accountTransfer;
