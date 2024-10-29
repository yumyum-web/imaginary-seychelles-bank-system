import { Handler } from "openapi-backend";
import conn from "../../helpers/db.js";
import { RowDataPacket } from "mysql2";
import { User } from "../../models/User.js";

const branchWiseTotalTransactionsReport: Handler = async (c, _, res) => {
  const user: User = c.security.jwt;

  try {
    const query = `
            SELECT Transaction_id   AS id,
                   Transaction_type AS type,
                   Activity_type    AS activityType,
                   Acc_id           AS accountId,
                   Amount           AS amount,
                   Date             AS date
            FROM Branch_transaction_report
            WHERE Branch_id = ?;
        `;
    const [rows] = await conn.execute<RowDataPacket[]>(query, [
      user.employee?.branchId,
    ]);

    return res.status(200).json(rows);
  } catch (error) {
    console.error(
      "Failed to generate branch wise total transactions report:",
      error,
    );
    return res.status(500).json({
      message: "Failed to generate branch wise total transactions report",
    });
  }
};

export default branchWiseTotalTransactionsReport;
