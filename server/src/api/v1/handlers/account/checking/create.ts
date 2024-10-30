import { Handler } from "openapi-backend";
import conn from "../../../helpers/db.js";
import { User } from "../../../models/User.js";
import { QueryError, ResultSetHeader } from "mysql2";

interface CreateCheckingAccountBody {
  customerId: number;
  initialDeposit: number;
}

const createCheckingAccount: Handler<CreateCheckingAccountBody> = async (
  c,
  _,
  res,
) => {
  const { customerId, initialDeposit } = c.request.requestBody;
  const user: User = c.security.jwt;

  if (initialDeposit < 0) {
    return res.status(400).json({
      message: "Initial deposit must be a positive number.",
    });
  }

  try {
    const query = `
        CALL Create_Checking_Account(?, ?, ?);
    `;
    const [result] = await conn.execute<ResultSetHeader>(query, [
      customerId,
      user.employee?.branchId,
      initialDeposit,
    ]);

    console.log("Create checking account result:", result);

    return res
      .status(201)
      .json({ message: "Checking account created successfully." });
  } catch (error) {
    if ((error as QueryError).code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({ message: "Invalid customer ID." });
    }
    console.error("Failed to create checking account:", error);
    return res
      .status(500)
      .json({ message: "Failed to create checking account." });
  }
};

export default createCheckingAccount;
