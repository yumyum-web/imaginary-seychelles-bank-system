import { Handler } from "openapi-backend";
import conn from "../../helpers/db.js";
import { ProcedureCallPacket, RowDataPacket } from "mysql2";
import { User } from "../../models/User.js";

interface TransactionHistoryBody {
  accountId: number;
}

const accountTransactionHistory: Handler<TransactionHistoryBody> = async (
  c,
  _,
  res,
) => {
  const { accountId } = c.request.requestBody;
  const user: User = c.security.jwt;

  try {
    if (!user.employee) {
      const ownershipQuery = `
                SELECT 1
                FROM Account
                WHERE Acc_id = ?
                  AND Customer_id = ?;
            `;
      const [ownershipResult] = await conn.execute<RowDataPacket[]>(
        ownershipQuery,
        [accountId, user.customer?.id],
      );
      if (ownershipResult.length === 0) {
        return res.status(403).json({
          message: "Customers can only view history of their own accounts.",
        });
      }
    }
    const transactionQuery = `
      SELECT T.Transaction_id AS id,
             T.Type           AS type,
             A.Type           AS activityType,
             A.Amount         AS amount,
             A.DATE           AS date
      FROM Transaction T
             JOIN Activity A ON A.Activity_id = T.Activity_id
      WHERE T.Acc_id = ?;
    `;
    const [result] = await conn.execute<ProcedureCallPacket<RowDataPacket[]>>(
      transactionQuery,
      [accountId],
    );
    console.log("Transaction history result:", result);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Failed to retrieve transactions:", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve transactions." });
  }
};

export default accountTransactionHistory;
