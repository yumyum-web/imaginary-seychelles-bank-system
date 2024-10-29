import { Handler } from "openapi-backend";
import conn from "../../../helpers/db.js";
import { User } from "../../../models/User.js";
import { ResultSetHeader } from "mysql2";

interface ListSavingsAccountsQuery {
  customerId?: number;
}

const listSavingsAccounts: Handler<
  unknown,
  unknown,
  ListSavingsAccountsQuery
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
               SA.No_of_withdrawals as noOfWithdrawals,
               SA.SA_plan_id        as planId,
               Sp.Name              AS planName,
               B.Branch_id          as branchName,
               B.Name               AS branchName
        FROM Account A
                 JOIN Savings_Account SA ON A.Acc_id = SA.Acc_id
                 JOIN SA_plan Sp on Sp.SA_plan_id = SA.SA_plan_id
                 JOIN Branch B on B.Branch_id = A.Branch_id
        WHERE Customer_id = ?;
    `;
  const [results] = await conn.execute<ResultSetHeader[]>(query, [
    customerId ?? user.customer?.id,
  ]);

  return res.status(200).json(results);
};

export default listSavingsAccounts;
