import { Handler } from "openapi-backend";
import conn from "../../../helpers/db.js";
import { RowDataPacket } from "mysql2";
import { User } from "../../../models/User.js";

const listLoanRequests: Handler = async (c, _, res) => {
  const user: User = c.security.jwt;

  try {
    let rows: RowDataPacket[];
    if (!user.employee) {
      const query = `
        SELECT lr.Request_id  AS id,
               lr.Employee_id AS employeeId,
               A.Customer_id  AS customerId,
               lr.Loan_type   AS type,
               lr.Amount      AS amount,
               lr.Purpose     AS purpose,
               lr.Status      AS status,
               lr.Time_Period AS timePeriod
        FROM Loan_Request lr
               JOIN Account A USING (Acc_id)
        WHERE A.Customer_id = ?
      `;
      [rows] = await conn.execute<RowDataPacket[]>(query, [user.customer?.id]);
    } else {
      const query = `
          SELECT lr.Request_id  AS id,
                 lr.Employee_id AS employeeId,
                 A.Customer_id  AS customerId,
                 lr.Loan_type   AS type,
                 lr.Amount      AS amount,
                 lr.Purpose     AS purpose,
                 lr.Status      AS status,
                 lr.Time_Period AS timePeriod
          FROM Loan_Request lr
                   JOIN Account A USING (Acc_id)
          WHERE A.Branch_id = ?
      `;
      [rows] = await conn.execute<RowDataPacket[]>(query, [
        user.employee.branchId,
      ]);
    }

    // Send the loan requests as a response
    return res.status(200).json(rows);
  } catch (error) {
    console.error("Failed to retrieve loan requests:", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve loan requests." });
  }
};

export default listLoanRequests;
