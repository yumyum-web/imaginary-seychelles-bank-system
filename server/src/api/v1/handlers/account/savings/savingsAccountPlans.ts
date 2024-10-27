import { Handler } from "openapi-backend";
import conn from "../../../helpers/db.js";
import { RowDataPacket } from "mysql2";

const listSavingsAccountPlans: Handler = async (_c, _, res) => {
  try {
    const query = `
        SELECT SA_plan_id    AS id,
               Name          AS name,
               Interest_rate AS interestRate,
               Min_balance   AS minimumBalance
        FROM SA_plan;
    `;
    const [rows] = await conn.execute<RowDataPacket[]>(query);

    return res.status(200).json(rows);
  } catch (error) {
    console.error("Failed to list savings account plans:", error);
    return res
      .status(500)
      .json({ message: "Failed to list savings account plans." });
  }
};

export default listSavingsAccountPlans;
