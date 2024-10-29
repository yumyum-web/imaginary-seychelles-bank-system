import { Handler } from "openapi-backend";
import conn from "../../helpers/db.js";
import { RowDataPacket } from "mysql2";

const fixedDepositPlans: Handler = async (_c, _, res) => {
  try {
    const query = `
            SELECT FD_plan_id    AS id,
                   Interest_rate AS interestRate,
                   Duration      AS duration
            FROM FD_plan;
        `;
    const [rows] = await conn.execute<RowDataPacket[]>(query);

    return res.status(200).json(rows);
  } catch (error) {
    console.error("Failed to list fixed deposit plans:", error);
    return res
      .status(500)
      .json({ message: "Failed to list fixed deposit plans." });
  }
};

export default fixedDepositPlans;
