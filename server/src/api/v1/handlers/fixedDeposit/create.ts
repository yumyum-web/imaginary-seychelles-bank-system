import { Handler } from "openapi-backend";
import conn from "../../helpers/db.js";
import { User } from "../../models/User.js";
import { QueryError, ResultSetHeader } from "mysql2";

interface CreateFixedDepositBody {
  initialDeposit: number;
  savingsAccountId: number;
  fixedDepositPlanId: number;
}

const createFixedDeposit: Handler<CreateFixedDepositBody> = async (
  c,
  _,
  res,
) => {
  const { initialDeposit, savingsAccountId, fixedDepositPlanId } =
    c.request.requestBody;
  const user: User = c.security.jwt;

  if (initialDeposit <= 0) {
    return res
      .status(400)
      .json({ message: "Initial deposit must be greater than 0." });
  }

  try {
    const query = `
        CALL Create_Fixed_Deposit(?, ?, ?, ?);
    `;
    const [result] = await conn.execute<ResultSetHeader>(query, [
      user.employee?.branchId,
      initialDeposit,
      savingsAccountId,
      fixedDepositPlanId,
    ]);

    console.log("Create fixed deposit result:", result);

    return res
      .status(201)
      .json({ message: "Fixed deposit created successfully." });
  } catch (error) {
    if ((error as QueryError).message === "Invalid Savings Account ID") {
      return res.status(400).json({ message: "Invalid Savings Account ID." });
    } else if ((error as QueryError).code === "ER_NO_REFERENCED_ROW_2") {
      return res
        .status(400)
        .json({ message: "Invalid Fixed Deposit Plan ID." });
    }
    console.error("Failed to create fixed deposit:", error);
    return res.status(500).json({ message: "Failed to create fixed deposit." });
  }
};

export default createFixedDeposit;
