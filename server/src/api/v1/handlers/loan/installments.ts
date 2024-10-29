import { Handler } from "openapi-backend";
import conn from "../../helpers/db.js";
import { RowDataPacket } from "mysql2";
import { User } from "../../models/User.js";

const pendingLoanInstallments: Handler = async (c, _, res) => {
  const user: User = c.security.jwt;

  try {
    const query = `
            SELECT Loan_id              AS id,
                   Installment_Amount   AS amount,
                   Installment_Due_Date AS dueDate
            FROM Pending_Loan_Installments
            WHERE Customer_id = ?;
        `;
    const [rows] = await conn.execute<RowDataPacket[]>(query, [
      user.customer?.id,
    ]);

    return res.status(200).json(rows);
  } catch (error) {
    console.error("Failed to retrieve pending loan installments.", error);
    return res.status(500).json({
      message: "Failed to retrieve pending loan installments.",
    });
  }
};

export default pendingLoanInstallments;
