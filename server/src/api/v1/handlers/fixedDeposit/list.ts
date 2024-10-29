import { Handler } from "openapi-backend";
import conn from "../../helpers/db.js";
import { User } from "../../models/User.js";
import { ResultSetHeader } from "mysql2";

interface ListFixedDepositBody {
  customerId?: number;
}

const listFixedDeposits: Handler<ListFixedDepositBody> = async (c, _, res) => {
  const { customerId } = c.request.requestBody;
  const user: User = c.security.jwt;

  if (
    !user.employee &&
    customerId !== undefined &&
    customerId !== user.customer?.id
  ) {
    return res.status(403).json({
      message: "Non-employees can only view their own fixed deposits",
    });
  }

  if (!user.customer && !customerId) {
    return res
      .status(400)
      .json({ message: "customerId is required for non-customers" });
  }

  const query = `
        SELECT FD.FD_id         as id,
               FD.Balance       as balance,
               FD.FD_plan_id    as planId,
               Fp.Interest_rate AS interestRate,
               Fp.Duration      AS duration,
               FD.Opened_date   as openedDate,
               B.Branch_id      as branchName,
               B.Name           AS branchName
        FROM Fixed_deposit FD
                 JOIN FD_plan Fp on Fp.FD_plan_id = FD.FD_plan_id
                 JOIN Branch B on B.Branch_id = FD.Branch_id
        WHERE Customer_id = ?;
    `;
  const [results] = await conn.execute<ResultSetHeader[]>(query, [
    customerId ?? user.customer?.id,
  ]);

  return res.status(200).json(results);
};

export default listFixedDeposits;
