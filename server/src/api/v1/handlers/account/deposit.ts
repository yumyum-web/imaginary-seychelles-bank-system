import { Handler } from "openapi-backend";
import conn from "../../helpers/db.js";
import { ProcedureCallPacket, RowDataPacket } from "mysql2";

interface DepositBody {
  accountId: number;
  amount: number;
}

const accountDeposit: Handler<DepositBody> = async (c, _, res) => {
  const { accountId, amount } = c.request.requestBody;

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
    console.error("Failed to deposit:", error);
    return res.status(500).json({ message: "Failed to deposit." });
  }
};

export default accountDeposit;
