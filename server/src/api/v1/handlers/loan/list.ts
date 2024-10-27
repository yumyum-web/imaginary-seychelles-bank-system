import { Handler } from "openapi-backend";
import conn from "../../helpers/db.js";
import { RowDataPacket } from "mysql2";
import { User } from "../../models/User.js";
interface LoanDetailsRequest {
  loanId: number;
  customerId: number;
}

const listLoans: Handler<LoanDetailsRequest> = async (c, _, res) => {
  const user: User = c.security.jwt;

  try {
    const query = `
      SELECT l.Loan_id       AS loan_id,
             l.Type          AS loan_type,
             l.Amount        AS amount,
             l.Purpose       AS purpose,
             l.Interest_Rate AS interest_rate,
             l.Request_id    AS request_id,
             l.StartDate     AS start_date,
             l.EndDate       AS end_date
      FROM Loan l
             JOIN Account A USING (Acc_id)
      WHERE A.Customer_id = ?
    `;
    // Retrieve loan list from the database
    const [rows] = await conn.execute<RowDataPacket[]>(query, [
      user.customer?.id,
    ]);

    // Send the loan list as a JSON response
    return res.status(200).json(rows);
  } catch (error) {
    console.error("Failed to retrieve loan list:", error);
    return res.status(500).json({ message: "Failed to retrieve loan list." });
  }
};

export default listLoans;
