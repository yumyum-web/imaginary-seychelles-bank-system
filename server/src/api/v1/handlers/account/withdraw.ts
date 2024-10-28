import { Handler } from "openapi-backend";
import conn from "../../helpers/db.js";
import { ProcedureCallPacket, RowDataPacket } from "mysql2";

interface WithdrawBody {
  accountId: number;
  amount: number;
}

const accountWithdraw: Handler<WithdrawBody> = async (c, _, res) => {
  const { accountId, amount } = c.request.requestBody;

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
    console.error("Failed to withdraw:", error);
    return res.status(500).json({ message: "Failed to withdraw." });
  }
};

export default accountWithdraw;
