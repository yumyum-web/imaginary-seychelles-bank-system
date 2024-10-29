import { Handler } from "openapi-backend";
import conn from "../../helpers/db.js";
import { RowDataPacket } from "mysql2";
import { User } from "../../models/User.js";

const branchWiseLateLoanInstallmentsReport: Handler = async (c, _, res) => {
  const user: User = c.security.jwt;

  try {
    const query = `
        SELECT Loan_id     AS id,
               Amount      AS loanAmount,
               Customer_id AS customerId,
               Type        AS loanType,
               StartDate   AS loanStartDate,
               EndDate     AS loanEndDate,
               Amount      AS amount,
               Due_date    AS dueDate
        FROM Late_loan_Installment_report
        WHERE Branch_id = ?;
    `;
    const [rows] = await conn.execute<RowDataPacket[]>(query, [
      user.employee?.branchId,
    ]);

    return res.status(200).json(rows);
  } catch (error) {
    console.error(
      "Failed to generate branch wise late loan installments report:",
      error,
    );
    return res.status(500).json({
      message: "Failed to generate branch wise late loan installments report",
    });
  }
};

export default branchWiseLateLoanInstallmentsReport;
