import { Handler } from "openapi-backend";
import conn from "../../../helpers/db.js";
import { User } from "../../../models/User.js";
import { ResultSetHeader } from "mysql2";

interface CreateSavingsAccountBody {
  customerId: number;
  planId: number;
  initialDeposit: number;
}

const createSavingsAccount: Handler<CreateSavingsAccountBody> = async (
  c,
  _,
  res,
) => {
  const { customerId, planId, initialDeposit } = c.request.requestBody;
  const user: User = c.security.jwt;

  try {
    const query = `
        CALL Create_Savings_Account(?, ?, ?, ?);
    `;
    const [result] = await conn.execute<ResultSetHeader>(query, [
      customerId,
      user.employee?.branchId,
      initialDeposit,
      planId,
    ]);

    console.log("Create savings account result:", result);

    return res
      .status(201)
      .json({ message: "Savings account created successfully." });
  } catch (error) {
    console.error("Failed to create savings account:", error);
    return res
      .status(500)
      .json({ message: "Failed to create savings account." });
  }
};

export default createSavingsAccount;
