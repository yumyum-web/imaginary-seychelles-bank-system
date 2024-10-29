import { Handler } from "openapi-backend";
import conn from "../../../helpers/db.js";
import { User } from "../../../models/User.js";
import { ResultSetHeader } from "mysql2";

interface ListCheckingAccountsQuery {
  customerId?: number;
}

const listCheckingAccounts: Handler<
  never,
  never,
  ListCheckingAccountsQuery
> = async (c, _, res) => {
  const { customerId } = c.request.query;
  const user: User = c.security.jwt;

  if (
    !user.employee &&
    customerId !== undefined &&
    customerId !== user.customer?.id
  ) {
    return res
      .status(403)
      .json({ message: "Non-employees can only view their own accounts" });
  }

  if (!user.customer && !customerId) {
    return res
      .status(400)
      .json({ message: "customerId is required for non-customers" });
  }

  const query = `
        SELECT A.Acc_id             as id,
               A.Balance            as balance,
               B.Branch_id          as branchId,
               B.Name               AS branchName
        FROM Account A
                 JOIN Branch B on B.Branch_id = A.Branch_id
        WHERE Customer_id = ? AND A.Type = 'Checking';
    `;
  const [results] = await conn.execute<ResultSetHeader[]>(query, [
    customerId ?? user.customer?.id,
  ]);

  return res.status(200).json(results);
};

export default listCheckingAccounts;
