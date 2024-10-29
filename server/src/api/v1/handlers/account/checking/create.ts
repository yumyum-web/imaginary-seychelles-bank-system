import { Handler } from "openapi-backend";
import conn from "../../../helpers/db.js";
import { User } from "../../../models/User.js";
import { ResultSetHeader } from "mysql2";

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
    console.error("Failed to create checking account:", error);
    return res
      .status(500)
      .json({ message: "Failed to create checking account." });
  }
};

export default createCheckingAccount;
