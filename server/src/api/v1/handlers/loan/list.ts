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
      SELECT l.Loan_id       AS loanId,
             l.Type          AS loanType,
             l.Amount        AS amount,
             l.Purpose       AS purpose,
             l.Interest_Rate AS interestRate,
             l.Request_id    AS requestId,
             l.StartDate     AS startDate,
             l.EndDate       AS endDate
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
