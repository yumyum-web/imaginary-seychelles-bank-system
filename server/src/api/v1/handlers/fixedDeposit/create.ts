import { Handler } from "openapi-backend";
import conn from "../../helpers/db.js";
import { User } from "../../models/User.js";
import { ResultSetHeader } from "mysql2";

interface CreateFixedDepositBody {
  customerId: number;
  initialDeposit: number;
  savingsAccountId: number;
  fixedDepositPlanId: number;
}

const createFixedDeposit: Handler<CreateFixedDepositBody> = async (
  c,
  _,
  res,
) => {
  const { customerId, initialDeposit, savingsAccountId, fixedDepositPlanId } =
    c.request.requestBody;
  const user: User = c.security.jwt;

  try {
    const query = `
        CALL Create_Fixed_Deposit(?, ?, ?, ?, ?);
    `;
    const [result] = await conn.execute<ResultSetHeader>(query, [
      customerId,
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
    console.error("Failed to create fixed deposit:", error);
    return res.status(500).json({ message: "Failed to create fixed deposit." });
  }
};

export default createFixedDeposit;
